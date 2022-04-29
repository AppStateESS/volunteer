<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\View;

use volunteer\Factory\PunchFactory;
use volunteer\Factory\VolunteerFactory;
use volunteer\Factory\SponsorFactory;
use volunteer\Factory\SettingsFactory;
use volunteer\Factory\ReasonFactory;
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

    public static function noMatchingHash(array $sponsor)
    {
        $template = new Template($sponsor);
        $template->setModuleTemplate('volunteer', 'Error/HashMismatch.html');
        return $template->get();
    }

    public static function noQuickLog(array $sponsor)
    {
        $template = new Template($sponsor);
        $template->setModuleTemplate('volunteer', 'Error/NoQuickLog.html');
        return $template->get();
    }

    public static function punchIn(Volunteer $volunteer, array $sponsor = null)
    {
        return self::scriptView('PunchIn',
                ['volunteerId' => $volunteer->getId(), 'volunteerName' => $volunteer->getPreferred(),
                    'defaultSponsor' => $sponsor, 'contactEmail' => SettingsFactory::getEmailAddressOnly()]);
    }

    public static function punchOut(Punch $punch)
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

    public static function quickPunchIn(string $hash, Volunteer $volunteer, int $sponsorId)
    {
        $sponsor = SponsorFactory::build($sponsorId);
        $templateFile = 'QuickPunchIn.html';
        if ($sponsor->useReasons) {
            $reasons = ReasonFactory::listing(['sponsorId' => $sponsorId]);
            if (!empty($reasons)) {
                $vars['reasons'] = $reasons;
                $templateFile = 'QuickPunchInReasons.html';
            }
        }

        $vars['sponsorId'] = $sponsor->id;
        $vars['sponsorName'] = $sponsor->name;
        $vars['preferredName'] = $volunteer->getPreferred();
        $vars['hash'] = $hash;
        $template = new Template($vars);
        $template->setModuleTemplate('volunteer', $templateFile);
        return $template->get();
    }

    public static function quickPunchOut(string $hash, Volunteer $volunteer, Punch $punch)
    {
        $sponsor = SponsorFactory::build($punch->sponsorId);
        $vars['preferredName'] = $volunteer->getPreferred();
        $vars['sponsorName'] = $sponsor->name;
        $vars['sponsorId'] = $sponsor->id;
        $vars['hash'] = $hash;
        $vars['punchId'] = $punch->id;

        $template = new Template($vars);
        $template->setModuleTemplate('volunteer', 'QuickPunchOut.html');
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

    public static function afterQuickPunch(string $hash, string $searchName)
    {
        $volunteer = VolunteerFactory::getByHash($hash);
        $template = new Template(['hash' => $hash, 'searchName' => $searchName, 'preferredName' => $volunteer->getPreferred()]);
        $template->setModuleTemplate('volunteer', 'AfterQuickPunch.html');
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
