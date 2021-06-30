<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer;

use phpws2\Database;
use phpws2\Database\ForeignKey;

class TableCreate
{

    public function createEventTable()
    {
        $db = Database::getDB();
        $event = new \volunteer\Resource\Event;
        return $event->createTable($db);
    }

    public function createPunchTable()
    {
        $db = Database::getDB();
        $punch = new \volunteer\Resource\Punch;
        return $punch->createTable($db);
    }

    public function createSponsorTable()
    {
        $db = Database::getDB();
        $sponsor = new \volunteer\Resource\Sponsor;
        return $sponsor->createTable($db);
    }

    public function createVolunteerTable()
    {
        $db = Database::getDB();
        $volunteer = new \volunteer\Resource\Volunteer;
        return $volunteer->createTable($db);
    }

    public function createKioskTable()
    {
        $db = Database::getDB();
        $kiosk = new \volunteer\Resource\KioskResource();
        return $kiosk->createTable($db);
    }

    public function createLogTable()
    {
        $db = Database::getDB();
        $log = new \volunteer\Resource\Log();
        return $log->createTable($db);
    }

    public function createKioskColumn()
    {
        $db = Database::getDB();
        $sponsor = $db->addTable('vol_sponsor');
        $km = $sponsor->addDataType('kioskMode', 'smallint');
        $km->add();
    }

    public function addApprovedColumnToPunch()
    {
        $db = Database::getDB();
        $punch = $db->addTable('vol_punch');
        $app = $punch->addDataType('approved', 'smallint');
        $app->add();
    }

    public function addPreApprovedColumnToSponsor()
    {
        $db = Database::getDB();
        $sponsor = $db->addTable('vol_sponsor');
        $app = $sponsor->addDataType('preApproved', 'smallint');
        $app->add();
    }

    public function addAttendanceColumn()
    {
        $db = Database::getDB();
        $sponsor = $db->addTable('vol_sponsor');
        $app = $sponsor->addDataType('attendanceOnly', 'smallint');
        $app->add();
    }

    public function addAttendedColumn()
    {
        $db = Database::getDB();
        $punch = $db->addTable('vol_punch');
        $app = $punch->addDataType('attended', 'smallint');
        $app->add();
    }

}
