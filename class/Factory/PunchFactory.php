<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Factory;

use phpws2\Database;
use volunteer\Resource\Volunteer;
use volunteer\Resource\Punch;
use \volunteer\Exception\PreviouslyPunched;

class PunchFactory extends AbstractFactory
{

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

    public static function out(Volunteer $volunteer, int $id)
    {
        $punch = new Punch;
        self::load($punch, $id);
        /**
         * Already punched out
         */
        if ($punch->timeOut > 0) {
            throw new PreviouslyPunched;
        }
        $punch->out();
        return self::save($punch);
    }

    public static function list(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_punch');

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
        $options['orderBy'] = 'timeIn';
        $options['dir'] = 'desc';
        parent::applyOptions($db, $tbl, $options);

        if (!empty($options['sponsorId'])) {
            $tbl->addFieldConditional('sponsorId', $options['sponsorId']);
        }
        return $db->select();
    }

}
