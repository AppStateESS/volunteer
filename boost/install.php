<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */
use phpws2\Database;
use phpws2\Database\ForeignKey;

function volunteer_install(&$content)
{
    $db = Database::getDB();
    $db->begin();

    try {
        $eventTable = createEventTable();
        $punchTable = createPunchTable();
        $sponsorTable = createSponsorTable();
        $volunteerTable = createVolunteerTable();
    } catch (\Exception $e) {
        \phpws2\Error::log($e);
        $db->rollback();

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

function createEventTable()
{
    $db = Database::getDB();
    $event = new \volunteer\Resource\Event;
    return $event->createTable($db);
}

function createPunchTable()
{
    $db = Database::getDB();
    $punch = new \volunteer\Resource\Punch;
    return $punch->createTable($db);
}

function createSponsorTable()
{
    $db = Database::getDB();
    $sponsor = new \volunteer\Resource\Sponsor;
    return $sponsor->createTable($db);
}

function createVolunteerTable()
{
    $db = Database::getDB();
    $volunteer = new \volunteer\Resource\Volunteer;
    return $volunteer->createTable($db);
}
