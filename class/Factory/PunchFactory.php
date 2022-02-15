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
use volunteer\Factory\ReasonFactory;
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

    public static function deleteByVolunteerId(int $volunteerId)
    {
        if (empty($volunteerId)) {
            throw new \Exception('Missing volunteer id');
        }
        $db = Database::getDB();
        $tbl = $db->addTable('vol_punch');
        $tbl->addFieldConditional('volunteerId', $volunteerId);
        return $db->delete();
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

    /**
     * Returns a JSON ready array of punch information based on the
     * current volunteer's status
     * @param Volunteer $volunteer
     * return array
     */
    public static function punchReply(Volunteer $volunteer, int $sponsorId, bool $includeReasons)
    {
        $punch = PunchFactory::currentPunch($volunteer);
        $sponsor = SponsorFactory::build($sponsorId);
        $volunteerName = $volunteer->getPreferred();
        $volunteerId = $volunteer->id;
        if ($punch) {
            if ((int) $punch->sponsorId !== (int) $sponsorId) {
                return ['success' => false, 'result' => 'punchedInElsewhere', 'volunteerName' => $volunteerName, 'volunteerId' => $volunteerId];
            } else {
                PunchFactory::out($punch);
                return ['success' => true, 'result' => 'out', 'volunteerName' => $volunteerName, 'volunteerId' => $volunteerId];
            }
        } else {
            if ($sponsor->useReasons) {
                /* Error check to prevent blank reason page */
                if ($includeReasons) {
                    $reasons = ReasonFactory::listing(['sponsorId' => $sponsor->id]);
                    if (empty($reasons)) {
                        PunchFactory::in($volunteer, $sponsorId);
                        return ['success' => true, 'result' => 'in', 'reasons' => [], 'volunteerName' => $volunteerName, 'volunteerId' => $volunteerId];
                    } else {
                        return ['success' => true, 'result' => 'reason', 'reasons' => $reasons, 'volunteerName' => $volunteerName, 'volunteerId' => $volunteerId];
                    }
                } else {
                    return ['success' => true, 'result' => 'reason', 'volunteerId' => $volunteer->id, 'volunteerName' => $volunteerName, 'volunteerId' => $volunteerId];
                }
            } else {
                PunchFactory::in($volunteer, $sponsorId);
                return ['success' => true, 'result' => 'in', 'reasons' => [], 'volunteerName' => $volunteerName, 'volunteerId' => $volunteerId];
            }
        }
    }

    public static function sortPunches(array $punches, bool $includeTotals = false)
    {
        $rows = [];
        $totalTimes = [];
        foreach ($punches as $punch) {
            if ($punch['timeOut']) {
                $punch['totalTime'] = self::getTotalTime($punch['timeIn'], $punch['timeOut']);
                $totalSeconds = $punch['timeOut'] - $punch['timeIn'];
                $punch['totalMinutes'] = (int) floor($totalSeconds / 60);
            } else {
                $punch['totalTime'] = '(' . self::getTotalTime($punch['timeIn'], time()) . ')';
                $punch['totalMinutes'] = 0;
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

        $sponsorList = SponsorFactory::list(['idList' => $sponsorIds, 'sortById' => true, 'includeDeleted' => true]);
        foreach ($sponsorList as $id => $sponsor) {
            $rows[$id]['sponsor'] = $sponsor['name'];
            $rows[$id]['deleted'] = $sponsor['deleted'];

            if ($includeTotals) {
                $totalHours = self::totalHours($totalTimes[$id]);
                $totalMinutes = self::totalMinutes($totalTimes[$id]);
                $rows[$id]['totalTime'] = self::buildTotalTime($totalHours, $totalMinutes);
                $rows[$id]['totalMinutes'] = (int) floor($totalTimes[$id] / 60);
            }
        }
        return array_values($rows);
    }

    /**
     * Punches the student in to the system.
     * @param Volunteer $volunteer
     * @param int $sponsorId
     * @return type
     * @throws \Exception
     */
    public static function in(Volunteer $volunteer, int $sponsorId, int $reasonId = 0)
    {
        $reasonAttended = false;

        if (empty($sponsorId)) {
            throw new \Exception('Missing sponsor is on punch in');
        }
        $sponsor = SponsorFactory::build($sponsorId);
        if ($reasonId) {
            $reasonAttended = ReasonFactory::isForceAttended($reasonId);
        }
        $punch = new Punch;
        $punch->volunteerId = $volunteer->id;
        $punch->sponsorId = $sponsorId;
        $punch->reasonId = $reasonId;
        $punch->in();
        /*
         * If sponsor tracks attendance only, we punch out and set approval now
         * to close it out.
         */
        if ($sponsor->attendanceOnly || $reasonAttended) {
            $punch->attended = 1;
            $punch->out();
            $punch->approved = SponsorFactory::isPreapproved($punch->sponsorId);
            VolunteerFactory::stampVisit($volunteer->id);
        }
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

        VolunteerFactory::stampVisit($punch->volunteerId);
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
        $expString = '(' . $tbl->getField('timeOut') . '-' . $tbl->getField('timeIn') . ')';
        $expression = new Database\Expression($expString, 'totalSeconds');
        $tbl->addField('volunteerId');
        $tbl->addField('sponsorId');
        $tbl->addField('timeIn');
        $tbl->addField('timeOut');
        $tbl->addField('approved');
        $tbl->addField('attended');
        $tbl->addField('reasonId');
        $tbl->addField('id');
        $expForOrder = $tbl->addField($expression, 'totalSeconds');

        if (!empty($options['unapprovedOnly'])) {
            $tbl->addFieldConditional('approved', 0);
            $tbl->addFieldConditional('timeOut', 0, '>');
        }

        if (!empty($options['waitingOnly'])) {
            $tbl->addFieldConditional('timeout', 0);
        }

        if (!empty($options['approvedOnly'])) {
            $tbl->addFieldConditional('approved', 1);
        }

        if (!empty($options['includeVolunteer'])) {
            $tbl2 = $db->addTable('vol_volunteer');
            $cond = $db->createConditional($tbl->getField('volunteerId'), $tbl2->getField('id'), '=');
            $tbl2->addField('userName');
            $tbl2->addField('firstName');
            $lastName = $tbl2->addField('lastName');
            $tbl2->addField('preferredName');
            $tbl2->addField('bannerId');
            $db->joinResources($tbl, $tbl2, $cond);
        }

        if (!empty($options['volunteerId'])) {
            $tbl->addFieldConditional('volunteerId', $options['volunteerId']);
        }

        $orderByMinutes = false;
        if (empty($options['orderBy'])) {
            $options['orderBy'] = 'timeIn';
            $options['orderByDir'] = 'desc';
        } elseif ($options['orderBy'] === 'totalSeconds') {
            $options['orderBy'] = $expForOrder;
        } elseif ($options['orderBy'] === 'lastName') {
            $options['orderBy'] = $lastName;
        }
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
                        $totalMinutes = floor($punch['totalSeconds'] / 60);
                        $result[$key]['totalTime'] = self::getTotalTime($punch['timeIn'],
                                $punch['timeOut']);
                        $result[$key]['totalMinutes'] = $totalMinutes;
                    } elseif (!empty($options['waitingOnly'])) {
                        $result[$key]['totalTime'] = self::getTotalTime($punch['timeIn'],
                                time());
                        $result[$key]['totalMinutes'] = 0;
                    } else {
                        $result[$key]['totalTime'] = '(' . self::getTotalTime($punch['timeIn'],
                                time()) . ')';
                        $result[$key]['totalMinutes'] = 0;
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
