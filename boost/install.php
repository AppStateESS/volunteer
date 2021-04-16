<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */
use phpws2\Database;
use phpws2\Database\ForeignKey;
use volunteer\TableCreate;

function volunteer_install(&$content)
{
    $db = Database::getDB();
    $db->begin();
    $tableCreate = new TableCreate;

    try {
        $eventTable = $tableCreate->createEventTable();
        $punchTable = $tableCreate->createPunchTable();
        $sponsorTable = $tableCreate->createSponsorTable();
        $volunteerTable = $tableCreate->createVolunteerTable();
        $kioskTable = $tableCreate->createKioskTable();
    } catch (\Exception $e) {
        \phpws2\Error::log($e);
        $db->rollback();

        if (isset($kioskTable)) {
            $kioskTable->drop();
        }
        if (isset($volunteerTable)) {
            $volunteerTable->drop();
        }
        if (isset($sponsorTable)) {
            $sponsorTable->drop();
        }
        if (isset($punchTable)) {
            $punchTable->drop();
        }
        if (isset($eventTable)) {
            $eventTable->drop();
        }
        throw $e;
    }
    $db->commit();

    $content[] = 'Tables created';
    return true;
}
