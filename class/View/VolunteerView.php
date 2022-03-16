<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\View;

use volunteer\Resource\Volunteer;
use volunteer\Factory\PunchFactory;
use volunteer\Factory\SponsorFactory;
use volunteer\Factory\VolunteerFactory;

class VolunteerView extends AbstractView
{

    public static function email(int $volunteerId)
    {
        $volunteer = VolunteerFactory::build($volunteerId);
        $vars = [];
        $vars['fullName'] = $volunteer->getFullName();
        $scriptVars['volunteerId'] = $volunteerId;
        $vars['form'] = self::scriptView('Email', $scriptVars);

        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('volunteer', 'Email.html');
        return $template->get();
    }

    public static function list(array $options = [])
    {
        return self::scriptView('Volunteer');
    }

    public static function logInPrompt()
    {
        $template = new \phpws2\Template();
        $template->setModuleTemplate('volunteer', 'Login.html');
        return $template->get();
    }

    public static function StudentNotFound()
    {
        $template = new \phpws2\Template();
        $template->setModuleTemplate('volunteer', 'Error/StudentNotFound.html');
        return $template->get();
    }

}
