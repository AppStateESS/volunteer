<?php

function volunteer_uninstall(&$content)
{
    $db = \phpws2\Database::getDB();
    $db->buildTable('vol_sponsor')->drop(true);
    $db->buildTable('vol_event')->drop(true);
    $db->buildTable('vol_volunteer')->drop(true);
    $db->buildTable('vol_punch')->drop(true);
    $db->buildTable('vol_kiosk')->drop(true);
    $db->buildTable('vol_log')->drop(true);

    // From previous version
    return true;
}
