<?php

/**
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */
use phpws2\Database;
use volunteer\TableCreate;

require_once PHPWS_SOURCE_DIR . 'mod/volunteer/config/defines.php';

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
                $tableCreate->createReasonToSponsorTable();
                $tableCreate->addUseReasonsColumnToSponsor();
                $tableCreate->addReasonIdColumnToPunch();
                $tableCreate->dropEventTable();
                $tableCreate->dropKioskTable();
                $this->content[] = '<pre>';
                $this->content[] = '1.2.0';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Can now delete punches.';
                $this->content[] = 'Can now delete volunteers.';
                $this->content[] = 'Added reasons';
                $this->content[] = 'Changed the shortlink to an access link.';
                $this->content[] = 'Added attended only functionality.';
                $this->content[] = 'Added CSV reports';
                $this->content[] = '</pre>';

            case $this->compare('1.3.0'):
                $tableCreate->addSponsorDeleteColumn();
                $this->content[] = '<pre>';
                $this->content[] = '1.3.0';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Single sponsors will not show selection.';
                $this->content[] = 'Add check all button to approvals.';
                $this->content[] = 'Can now delete sponsors (flagged) and reasons.';
                $this->content[] = '</pre>';

            case $this->compare('1.4.0'):
                $tableCreate->addSponsorDefaultColumn();
                $tableCreate->addVolunteerEmailColumn();
                $tableCreate->copyEmailAddresses();
                $tableCreate->addUniqueToEmail();
                $tableCreate->addVolunteerVisitColumns();
                $this->content[] = '<pre>';
                $this->content[] = '1.4.0';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Admin panel added to kiosk view.';
                $this->content[] = 'Pick default sponsor for front page.';
                $this->content[] = 'Added waiting report.';
                $this->content[] = 'Non-student visitors can now log in.';
                $this->content[] = 'Volunteers last log and number of visits is tracked.';
                $this->content[] = '</pre>';

            case $this->compare('1.4.1'):
                $this->content[] = '<pre>';
                $this->content[] = '1.4.1';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Volunteer name added to kiosk output.';
                $this->content[] = '</pre>';

            case $this->compare('1.4.2'):
                $this->content[] = '<pre>';
                $this->content[] = '1.4.2';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Fixed email verification bug.';
                $this->content[] = '</pre>';

            case $this->compare('1.4.3'):
                $this->content[] = '<pre>';
                $this->content[] = '1.4.3';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Fixed single day date setting.';
                $this->content[] = 'Default report time is one week instead of one month';
                $this->content[] = 'Added reset button';
                $this->content[] = '</pre>';
            case $this->compare('1.4.4'):
                $this->content[] = '<pre>';
                $this->content[] = '1.4.4';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Added totalMinutes to CSV report.';
                $this->content[] = 'Better time in and out format in report.';
                $this->content[] = '</pre>';
            case $this->compare('1.5.0'):
                $this->content[] = '<pre>';
                $this->content[] = '1.5.0';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Sorting added to lists';
                $this->content[] = 'Preferred names used instead of first name.';
                $this->content[] = '</pre>';
            case $this->compare('1.5.1'):
                $this->content[] = '<pre>';
                $this->content[] = '1.5.1';
                $this->content[] = '-----------------------------';
                $this->content[] = 'Fixed volunteer sorting';
                $this->content[] = '</pre>';
        }
        return $this->content;
    }

}
