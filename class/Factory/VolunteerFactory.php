<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Factory;

use phpws2\Database;
use volunteer\Resource\Volunteer;

class VolunteerFactory extends AbstractFactory
{

    public static function currentUserIsStudent()
    {

    }

    public static function loadCurrent()
    {
        $volunteer = self::loadByUsername(Authenticate::getLoginUsername());
        if ($volunteer) {
            return $volunteer;
        } else {
            return self::createVolunteer(Authenticate::getLoginUsername());
        }
    }

    public static function loadByUsername(string $username)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_volunteer');
        $tbl->addFieldConditional('userName', $username);
        $row = $db->selectOneRow();
        if (empty($row)) {
            return false;
        } else {
            $volunteer = new Volunteer;
            $volunteer->setVars($row);
            return $volunteer;
        }
    }

    protected static function createVolunteer(string $username)
    {
        $result = Banner::pullByUsername($username);
        if ($result['success']) {
            $student = $result['student'];
            $volunteer = new Volunteer;
            $volunteer->userName = $username;
            $volunteer->firstName = $student->firstName;
            $volunteer->lastName = $student->lastName;
            $volunteer->preferredName = $student->preferredName;
            $volunteer->bannerId = (string) $student->ID;
            self::saveResource($volunteer);
            return $volunteer;
        } else {
            throw new \volunteer\Exception\StudentNotFound;
        }
    }

}
