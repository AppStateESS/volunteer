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

    public static function report(Volunteer $volunteer)
    {
        $punches = PunchFactory::list(['volunteerId' => $volunteer->id]);
        $vars['name'] = $volunteer->getFullName();
        if (!empty($punches)) {
            $vars['rows'] = self::sortPunches($punches);
        }
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('volunteer', 'Report.html');
        return $template->get();
    }

    private static function sortPunches(array $punches)
    {
        $rows = [];
        foreach ($punches as $punch) {
            if ($punch['timeOut']) {
                $punch['totalTime'] = PunchFactory::getTotalTime($punch['timeIn'], $punch['timeOut']);
            } else {
                $punch['totalTime'] = 'N/A';
            }
            $rows[$punch['sponsorId']]['punches'][] = $punch;
        }
        $sponsorIds = array_keys($rows);

        $sponsorList = SponsorFactory::list(['idList' => $sponsorIds, 'sortById' => true]);
        foreach ($sponsorList as $id => $sponsor) {
            $rows[$id]['sponsor'] = $sponsor['name'];
        }
        return $rows;
    }

    public static function logInPrompt()
    {
        $template = new \phpws2\Template();
        $template->setModuleTemplate('volunteer', 'Login.html');
        return $template->get();
    }

}
