<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\View;

use volunteer\Factory\PunchFactory;
use volunteer\Factory\VolunteerFactory;
use volunteer\Factory\SponsorFactory;
use volunteer\Resource\Punch;
use phpws2\Template;

class PunchView extends AbstractView
{

    public static function punchButton()
    {
        $currentVolunteer = VolunteerFactory::loadCurrent();
        $punch = PunchFactory::currentPunch($currentVolunteer);
        if ($punch === false) {
            return self::punchIn();
        } else {
            return self::punchOut($punch);
        }
    }

    private static function punchIn()
    {
        return self::scriptView('PunchIn');
    }

    private static function punchOut(Punch $punch)
    {
        $currentVolunteer = VolunteerFactory::loadCurrent();
        $vars['volunteer'] = $currentVolunteer->getStringVars();
        $vars['punch'] = $punch->getStringVars();
        $sponsor = SponsorFactory::build($punch->sponsorId);
        $vars['sponsor'] = $sponsor->getStringVars();
        $vars['totalTime'] = self::getTotalTime($punch->timeIn);
        var_dump($vars);
        exit;
        $template = new Template($vars);
        $template->setModuleTemplate('volunteer', 'PunchOut.html');
        return $template->get();
    }

    private static function noSponsors()
    {
        $template = new Template();
        $template->setModuleTemplate('volunteer', 'NoSponsors.html');
        return $template->get();
    }

    private static function getTotalTime($timeIn)
    {
        $totalSeconds = time() - $timeIn;
        $totalHours = floor($totalSeconds / 3600);
        $totalMinutes = $totalSeconds % 3600;
        $totalTime = [];
        if ($totalHours > 0) {
            $totalTime[] = $totalHours . ' hour' . ($totalHours > 1 ? 's' : '') . ' and ';
        }
        $totalTime[] = $totalMinutes . ' minute' . ( ($totalMinutes > 1 || $totalMinutes == 0) ? 's' : '');
    }

    public static function afterPunchIn(int $punchId)
    {

        $template = new Template();
        $template->addModuleTemplate('volunteer', 'AfterPunchIn.html');
        return $template->get();
    }

}
