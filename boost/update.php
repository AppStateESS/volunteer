<?php

/**
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */
use phpws2\Database;
use volunteer\TableCreate;

function volunteer_update(&$content, $currentVersion)
{
    $update = new VolunteerDataUpdate($content, $currentVersion);
    $content = $update->run();
    return true;
}

class VolunteerDataUpdate
{

    private $content;
    private $cversion;

    public function __construct($content, $cversion)
    {
        $this->content = $content;
        $this->cversion = $cversion;
    }

    private function compare($version)
    {
        return version_compare($this->cversion, $version, '<');
    }

    public function run()
    {
        $tableCreate = new TableCreate;
        switch (1) {
            case $this->compare('1.1.0'):
                $tableCreate->createKioskTable();
                $tableCreate->createKioskColumn();
                $this->content[] = '<pre>';
                $this->content[] = '1.1.0';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Added kiosk mode';
                $this->content[] = 'Focus sent to input after clicking Clear.';
                $this->content[] = '</pre>';
        }
        return $this->content;
    }

}