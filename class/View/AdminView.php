<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\View;

use Canopy\Request;
use volunteer\Factory\PunchFactory;

class AdminView
{

    private static function menu(string $active = null)
    {
        $sponsorActive = null;
        $volunteerActive = null;
        $unapprovedActive = null;
        $reasonActive = null;
        $settingsActive = null;
        switch ($active) {
            case 'sponsor':
                $sponsorActive = 'active';
                break;
            case 'unapproved':
                $unapprovedActive = 'active';
                break;
            case 'volunteer':
                $volunteerActive = 'active';
                break;
            case 'reason':
                $reasonActive = 'active';
                break;
            case 'settings':
                $settingsActive = 'active';
                break;
        }
        $auth = \Current_User::getAuthorization();

        $unapproved = PunchFactory::unapprovedCount();
        $activeTpl = ['logoutUrl' => \volunteer\Factory\Authenticate::logoutUrl(),
            'sponsorActive' => $sponsorActive,
            'reasonActive' => $reasonActive,
            'volunteerActive' => $volunteerActive,
            'unapprovedActive' => $unapprovedActive,
            'settingsActive' => $settingsActive,
            'unapproved' => $unapproved];
        $template = new \phpws2\Template($activeTpl);
        $template->setModuleTemplate('volunteer', 'Menu.html');
        return $template->get();
    }

    public static function showMenu(string $active = null)
    {
        \Layout::plug(self::menu($active), 'NAV_LINKS');
    }

}
