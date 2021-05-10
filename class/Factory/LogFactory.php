<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Factory;

use phpws2\Database;
use volunteer\Resource\Log;
use volunteer\Resource\Punch;

class LogFactory extends AbstractFactory
{

    /**
     *
     * @param int $id
     * @return volunteer\Resource\Log
     */
    public static function build(int $id = 0)
    {
        $log = new Log;
        return $id > 0 ? self::load($log, $id) : $log;
    }

    public static function list(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_log');
        if (!empty($options['sponsorId'])) {
            $tbl->addFieldConditional('sponsorId', $options['sponsorId']);
        }
        if (!empty($options['volunteerId'])) {
            $tbl->addFieldConditional('volunteerId', $options['volunteerId']);
        }

        if (!empty($options['includeUser'])) {
            $tbl2 = $db->addTable('users');
            $cond = new Database\Conditional($db, $tbl->getField('userId'), $tbl2->getField('id'),
                    '=');
            $tbl2->addField('display_name', 'userDisplayName');
            $db->joinResources($tbl, $tbl2, $cond, 'left');
        }
        if (!empty($options['includeSponsor'])) {
            $tbl3 = $db->addTable('vol_sponsor');
            $cond = new Database\Conditional($db, $tbl->getField('sponsorId'),
                    $tbl3->getField('id'), '=');
            $tbl3->addField('name', 'sponsorName');
            $db->joinResources($tbl, $tbl3, $cond, 'left');
        }
        if (!empty($options['includeVolunteer'])) {
            $tbl4 = $db->addTable('vol_volunteer');
            $cond = new Database\Conditional($db, $tbl->getField('volunteerId'),
                    $tbl4->getField('id'), '=');
            $concat = 'concat(' . $tbl4->getField('firstName') . '," (",' . $tbl4->getField('preferredName') . ',") ",' . $tbl4->getField('lastName') . ')';
            $expression = new Database\Expression($concat, 'volunteerName');
            $db->addExpression($expression);
            $db->joinResources($tbl, $tbl4, $cond, 'left');
        }

        if (empty($options['limit'])) {
            $db->setLimit(100);
        }

        $tbl->addOrderBy('timestamp', 'desc');
        return $db->select();
    }

    public static function approved(int $punchId, int $sponsorId = 0, int $volunteerId = 0)
    {
        $log = self::build();
        $log->action = 'approved';
        $log->punchId = $punchId;
        if ($sponsorId) {
            $log->sponsorId = $sponsorId;
        } else {
            $log->sponsorId = PunchFactory::getSponsorId($punchId);
        }
        if ($volunteerId) {
            $log->volunteerId = $volunteerId;
        } else {
            $log->volunteerId = PunchFactory::getVolunteerId($punchId);
        }
        $log->stamp();
        $log->userId = \Current_User::getId();
        self::save($log);
    }

    public static function timeChange($timeIn, $timeOut, Punch $newPunch)
    {
        $log = self::build();
        $log->action = 'timeChange';
        $log->punchId = $newPunch->id;
        $log->sponsorId = $newPunch->sponsorId;
        $log->stamp();
        $log->userId = \Current_User::getId();

        $log->oldTimeIn = $timeIn;
        $log->oldTimeOut = $timeOut;
        $log->newTimeIn = $newPunch->timeIn;
        $log->newTimeOut = $newPunch->timeOut;
        self::save($log);
    }

}
