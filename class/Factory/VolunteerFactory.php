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

    public static function build(int $id = 0)
    {
        $volunteer = new Volunteer;
        return $id > 0 ? self::load($volunteer, $id) : $volunteer;
    }

    public static function loadCurrent($createIfNotFound = true)
    {
        $volunteer = self::loadByUsername(Authenticate::getLoginUsername());
        if ($volunteer) {
            return $volunteer;
        } elseif ($createIfNotFound) {
            return self::createVolunteer(Authenticate::getLoginUsername());
        } else {
            Authenticate::sendToLogin();
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
            $volunteer->preferredName = $student->preferredName ?? null;
            $volunteer->bannerId = (string) $student->bannerID;
            self::saveResource($volunteer);
            return $volunteer;
        } else {
            throw new \volunteer\Exception\StudentNotFound($username);
        }
    }

    public static function list($options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_volunteer');
        parent::applyOptions($db, $tbl, $options);
        return $db->select();
    }

}
