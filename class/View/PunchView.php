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
use volunteer\Resource\Volunteer;
use phpws2\Template;

class PunchView extends AbstractView
{

    public static function punchButton(array $sponsor = null)
    {
        $currentVolunteer = VolunteerFactory::loadCurrent();
        $punch = PunchFactory::currentPunch($currentVolunteer);
        if ($punch === false) {
            return self::punchIn($currentVolunteer, $sponsor);
        } else {
            return self::punchOut($punch);
        }
    }

    private static function punchIn(Volunteer $volunteer, array $sponsor = null)
    {
        return self::scriptView('PunchIn',
                        ['volunteerName' => $volunteer->getPreferred(), 'defaultSponsor' => $sponsor, 'contactEmail' => VOL_CONTACT_EMAIL]);
    }

    private static function punchOut(Punch $punch)
    {
        $currentVolunteer = VolunteerFactory::loadCurrent();
        $vars['volunteer'] = $currentVolunteer->getStringVars();
        $vars['punch'] = $punch->getStringVars();
        $sponsor = SponsorFactory::build($punch->sponsorId);
        $vars['sponsor'] = $sponsor->getStringVars();
        $vars['totalTime'] = PunchFactory::getTotalTime($punch->timeIn, time(), false);
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

    public static function afterPunchIn(int $punchId)
    {
        $punch = PunchFactory::build($punchId);
        $sponsor = SponsorFactory::build($punch->sponsorId);
        $template = new Template(['logoutUrl' => \volunteer\Factory\Authenticate::logoutUrl(), 'sponsorName' => $sponsor->name, 'attended' => $punch->attended]);
        $template->setModuleTemplate('volunteer', 'AfterPunchIn.html');
        return $template->get();
    }

    public static function afterPunchOut()
    {
        $template = new Template(['logoutUrl' => \volunteer\Factory\Authenticate::logoutUrl()]);
        $template->setModuleTemplate('volunteer', 'AfterPunchOut.html');
        return $template->get();
    }

    public static function previouslyPunched()
    {
        $template = new Template;
        $template->setModuleTemplate('volunteer', 'PreviouslyPunched.html');
        return $template->get();
    }

    public static function unapproved()
    {
        return self::scriptView('Unapproved');
    }

}
