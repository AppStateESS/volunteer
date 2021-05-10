<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\View;

use volunteer\Factory\LogFactory;
use volunteer\Factory\SponsorFactory;
use volunteer\Factory\VolunteerFactory;

class LogView
{

    public static function sponsor(int $sponsorId)
    {
        $vars['rows'] = LogFactory::list(['sponsorId' => $sponsorId, 'includeUser' => true, 'includeVolunteer' => true]);
        $sponsor = SponsorFactory::build($sponsorId);
        $vars['name'] = $sponsor->name;
        $vars['logType'] = 'sponsor';
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('volunteer', 'Log.html');
        return $template->get();
    }

    public static function volunteer(int $volunteerId)
    {
        $vars['rows'] = LogFactory::list(['volunteerId' => $volunteerId, 'includeUser' => true, 'includeSponsor' => true]);
        $volunteer = VolunteerFactory::build($volunteerId);
        $vars['logType'] = 'volunteer';
        $vars['name'] = $volunteer->getFullName();
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('volunteer', 'Log.html');
        return $template->get();
    }

}
