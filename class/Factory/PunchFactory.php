<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Factory;

use phpws2\Database;
use volunteer\Resource\Volunteer;
use volunteer\Resource\Punch;
use volunteer\Exception\PreviouslyPunched;
use volunteer\Factory\SponsorFactory;
use volunteer\Factory\LogFactory;

class PunchFactory extends AbstractFactory
{

    public static function approve(Punch $punch)
    {
        $punch->approve = true;
        self::save($punch);
    }

    /**
     *
     * @param int $id
     * @return Punch
     */
    public static function build(int $id = 0)
    {
        $punch = new Punch;
        return $id > 0 ? self::load($punch, $id) : $punch;
    }

    /**
     * Grabs an incomplete punch for the current volunteer.
     * @param Volunteer $volunteer
     */
    public static function currentPunch(Volunteer $volunteer)
    {

        $db = Database::getDB();
        $tbl = $db->addTable('vol_punch');
        $tbl->addFieldConditional('volunteerId', $volunteer->id);
        $tbl->addFieldConditional('timeIn', 0, '>');
        $tbl->addFieldConditional('timeOut', 0, '=');
        $result = $db->selectOneRow();
        if (empty($result)) {
            return false;
        } else {
            $punch = new Punch;
            $punch->setVars($result);
            return $punch;
        }
    }

    public static function sortPunches(array $punches, bool $includeTotals = false)
    {
        $rows = [];
        $totalTimes = [];
        foreach ($punches as $punch) {
            if ($punch['timeOut']) {
                $punch['totalTime'] = self::getTotalTime($punch['timeIn'], $punch['timeOut']);
            } else {
                $punch['totalTime'] = '(' . self::getTotalTime($punch['timeIn'], time()) . ')';
            }
            $rows[$punch['sponsorId']]['punches'][] = $punch;
            if ($includeTotals) {
                if (!isset($totalTimes[$punch['sponsorId']])) {
                    $totalTimes[$punch['sponsorId']] = 0;
                }
                if ($punch['timeOut'] > 0) {
                    $totalTimes[$punch['sponsorId']] += $punch['timeOut'] - $punch['timeIn'];
                }
            }
        }

        $sponsorIds = array_keys($rows);

        $sponsorList = SponsorFactory::list(['idList' => $sponsorIds, 'sortById' => true]);
        foreach ($sponsorList as $id => $sponsor) {
            $rows[$id]['sponsor'] = $sponsor['name'];
            if ($includeTotals) {
                $totalHours = self::totalHours($totalTimes[$id]);
                $totalMinutes = self::totalMinutes($totalTimes[$id]);
                $rows[$id]['totalTime'] = self::buildTotalTime($totalHours, $totalMinutes);
            }
        }
        return array_values($rows);
    }

    public static function in(Volunteer $volunteer, int $sponsorId)
    {
        if (empty($sponsorId)) {
            throw new \Exception('Missing sponsor is on punch in');
        }
        $punch = new Punch;
        $punch->volunteerId = $volunteer->id;
        $punch->sponsorId = $sponsorId;
        $punch->eventId = 0;
        $punch->in();
        return self::save($punch);
    }

    public static function out(Punch $punch)
    {
        /**
         * Already punched out
         */
        if ($punch->timeOut > 0) {
            throw new PreviouslyPunched;
        }
        $punch->out();
        $punch->approved = SponsorFactory::isPreapproved($punch->sponsorId);

        return self::save($punch);
    }

    /**
     * Options are:
     * - unapprovedOnly = only return punches that are not approved
     * - includeVolunteer = adds all volunteer information (name, banner id, etc) to the punch
     * - volunteerId = if set, only pull punches with this volunteer id.
     * - sponsorId = if set, only pull punches with this sponsor id.
     * - includeSponsor = if set, include the sponsor's name as sponsorName
     * - includeTotals = returns a total of all hours for a sponsor. includeSponsor option is
     *   required.
     * @param array $options
     * @return array
     */
    public static function list(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_punch');

        if (!empty($options['unapprovedOnly'])) {
            $tbl->addFieldConditional('approved', 0);
            $tbl->addFieldConditional('timeOut', 0, '>');
        }

        if (!empty($options['includeVolunteer'])) {
            $tbl2 = $db->addTable('vol_volunteer');
            $cond = $db->createConditional($tbl->getField('volunteerId'), $tbl2->getField('id'), '=');
            $tbl2->addField('userName');
            $tbl2->addField('firstName');
            $tbl2->addField('lastName');
            $tbl2->addField('preferredName');
            $tbl2->addField('bannerId');
            $db->joinResources($tbl, $tbl2, $cond);
        }

        if (!empty($options['volunteerId'])) {
            $tbl->addFieldConditional('volunteerId', $options['volunteerId']);
        }
        $options['orderBy'] = 'timeIn';
        $options['dir'] = 'desc';
        parent::applyOptions($db, $tbl, $options);

        if (!empty($options['sponsorId'])) {
            $tbl->addFieldConditional('sponsorId', $options['sponsorId']);
        }

        if (!empty($options['includeSponsor'])) {
            $tbl3 = $db->addTable('vol_sponsor');
            $cond = $db->createConditional($tbl->getField('sponsorId'), $tbl3->getField('id'), '=');
            $tbl3->addField('name', 'sponsorName');
            $db->joinResources($tbl, $tbl3, $cond);
        }
        if (!empty($options['from'])) {
            $from = self::dayStart($options['from']);
            $tbl->addFieldConditional('timeIn', $from, '>=');
            if (!empty($options['to']) && $options['to'] > $options['from']) {
                $to = self::dayEnd($options['to']);
                $tbl->addFieldConditional('timeOut', $to, '<=');
            }
        }

        $result = $db->select();
        if (!empty($result)) {
            if (!empty($options['sortBySponsor'])) {
                $result = self::sortPunches($result, !empty($options['includeTotals']));
            } else {
                foreach ($result as $key => $punch) {
                    if ($punch['timeOut']) {
                        $result[$key]['totalTime'] = self::getTotalTime($punch['timeIn'],
                                        $punch['timeOut']);
                    } else {
                        $result[$key]['totalTime'] = '(' . self::getTotalTime($punch['timeIn'],
                                        time()) . ')';
                    }
                }
            }
        }

        return $result;
    }

    public static function dayStart($timestamp)
    {
        return strtotime("0:00:00", $timestamp);
    }

    public static function dayEnd($timestamp)
    {
        return strtotime("23:59:59", $timestamp);
    }

    public static function getTotalTime($timeIn, $timeOut, $abbreviated = true)
    {
        $totalSeconds = $timeOut - $timeIn;
        $totalHours = self::totalHours($totalSeconds);
        $totalMinutes = self::totalMinutes($totalSeconds);
        return self::buildTotalTime($totalHours, $totalMinutes, $abbreviated);
    }

    public static function totalHours($seconds)
    {
        return floor($seconds / 3600);
    }

    public static function totalMinutes($seconds)
    {
        return floor(($seconds % 3600) / 60);
    }

    public static function unapprovedCount()
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_punch');
        $tbl->addFieldConditional('approved', 0);
        $tbl->addFieldConditional('timeOut', 0, '>');
        $tbl->addField(new Database\Expression('count(' . $tbl->getField('id') . ')'));
        return $db->selectColumn();
    }

    public static function buildTotalTime($hours, $minutes, $abbreviated = true)
    {
        if ($abbreviated) {
            $h_label = 'hr';
            $m_label = 'min';
        } else {
            $h_label = 'hour';
            $m_label = 'minute';
        }
        $totalTime = [];
        if ($hours > 0) {
            $totalTime[] = $hours . " $h_label" . ($hours > 1 ? 's' : '');
            if ($h_label == 'hr') {
                $totalTime[] = '.';
            }
            $totalTime[] = ' and ';
        }
        $totalTime[] = $minutes . " $m_label" . ( ($minutes > 1 || $minutes == 0) ? 's.' : '.');
        return implode('', $totalTime);
    }

    public static function massApprove(array $approvals)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_punch');
        $tbl->addFieldConditional('id', $approvals, 'in');
        $tbl->addValue('approved', 1);
        return $db->update();
    }

    public static function getSponsorId(int $punchId)
    {
        return self::build($punchId)->sponsorId;
    }

    public static function getVolunteerId(int $punchId)
    {
        return self::build($punchId)->volunteerId;
    }

}
