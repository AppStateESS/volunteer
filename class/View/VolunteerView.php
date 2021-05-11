<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\View;

use volunteer\Resource\Volunteer;
use volunteer\Factory\PunchFactory;
use volunteer\Factory\SponsorFactory;

class VolunteerView extends AbstractView
{

    public static function list(array $options = [])
    {
        return self::scriptView('Volunteer', ['domain' => VOL_SHIB_DOMAIN]);
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
        $template->setModuleTemplate('volunteer', 'StudentNotFound.html');
        return $template->get();
    }

}
