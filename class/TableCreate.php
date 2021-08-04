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

    public function createReasonTable()
    {
        $db = Database::getDB();
        $reason = new \volunteer\Resource\Reason;
        return $reason->createTable($db);
    }

    public function createVolunteerTable()
    {
        $db = Database::getDB();
        $volunteer = new \volunteer\Resource\Volunteer;
        return $volunteer->createTable($db);
    }

    public function createReasonToSponsorTable()
    {
        $db = Database::getDB();
        $tbl = $db->buildTable('vol_reasontosponsor');
        $reasonId = $tbl->addDataType('reasonId', 'int');
        $sponsorId = $tbl->addDataType('sponsorId', 'int');
        $tbl->create();
        $unique = new \phpws2\Database\Unique([$sponsorId, $reasonId]);
        $unique->add();
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

    public function dropEventTable()
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_event');
        $tbl->drop(true);
    }

    public function dropKioskTable()
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_kiosk');
        $tbl->drop(true);
    }

    public function addVolunteerEmailColumn()
    {
        $db = Database::getDB();
        $volunteer = $db->addTable('vol_volunteer');
        $email = $volunteer->addDataType('email', 'varchar');
        $email->setSize(100);
        $email->add();
    }

    public function addUniqueToEmail()
    {
        $db = Database::getDB();
        $volunteer = $db->addTable('vol_volunteer');
        $email = $volunteer->getDataType('email');
        $unique = new \phpws2\Database\Unique([$email]);
        $unique->add();
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

    public function addReasonIdColumnToPunch()
    {
        $db = Database::getDB();
        $punch = $db->addTable('vol_punch');
        $rid = $punch->addDataType('reasonId', 'int');
        $rid->add();
    }

    public function addSponsorDeleteColumn()
    {
        $db = Database::getDB();
        $sponsor = $db->addTable('vol_sponsor');
        $delete = $sponsor->addDataType('deleted', 'smallint');
        $delete->add();
    }

    public function addSponsorDefaultColumn()
    {
        $db = Database::getDB();
        $sponsor = $db->addTable('vol_sponsor');
        $default = $sponsor->addDataType('defaultFront', 'smallint');
        $default->add();
    }

    public function addUseReasonsColumnToSponsor()
    {
        $db = Database::getDB();
        $sponsor = $db->addTable('vol_sponsor');
        $app = $sponsor->addDataType('useReasons', 'smallint');
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

    public function addVolunteerVisitColumns()
    {
        $db = Database::getDB();
        $volunteer = $db->addTable('vol_volunteer');
        $app1 = $volunteer->addDataType('lastLog', 'int');
        $app2 = $volunteer->addDataType('totalVisits', 'smallint');
        $app1->add();
        $app2->add();
    }

    public function copyEmailAddresses()
    {
        $domain = VOL_SHIB_DOMAIN;
        $db = Database::getDB();
        $db->exec("update vol_volunteer set email = concat(userName, '$domain')");
    }

}
