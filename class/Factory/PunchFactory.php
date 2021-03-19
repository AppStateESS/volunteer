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

    public static function out(int $id)
    {
        $punch = new Punch;
        self::load($punch, $id);
        /**
         * Already punched out
         */
        if ($punch->out > 0) {
            throw new PreviouslyPunched;
        }
        $punch->out();
        return self::save($punch);
    }

}