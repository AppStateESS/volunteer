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
                $tableCreate->createLogTable();
                $tableCreate->addApprovedColumnToPunch();
                $tableCreate->addPreApprovedColumnToSponsor();
                $tableCreate->addUseReasonsColumnToSponsor();
                $this->content[] = '<pre>';
                $this->content[] = '1.1.0';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Added kiosk mode';
                $this->content[] = 'Added punch preapproved option for sponsors';
                $this->content[] = 'Added logging';
                $this->content[] = 'Many improvements and bug fixes';
                $this->content[] = '</pre>';

            case $this->compare('1.1.1'):
                $this->content[] = '<pre>';
                $this->content[] = '1.1.1';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Fixed sponsor listing bug.';
                $this->content[] = 'Fixed unapproved list showing those not punched out.';
                $this->content[] = '</pre>';

            case $this->compare('1.1.2'):
                $this->content[] = '<pre>';
                $this->content[] = '1.1.2';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Fixed logout.';
                $this->content[] = '</pre>';

            case $this->compare('1.2.0'):
                $tableCreate->addAttendanceColumn();
                $tableCreate->addAttendedColumn();
                $tableCreate->createReasonTable();
                $this->content[] = '<pre>';
                $this->content[] = '1.2.0';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Can now delete punches.';
                $this->content[] = 'Can now delete volunteers.';
                $this->content[] = 'Added reasons';
                $this->content[] = 'Changed the shortlink to an access link.';
                $this->content[] = 'Added attended only functionality.';
                $this->content[] = '</pre>';
        }
        return $this->content;
    }

}
