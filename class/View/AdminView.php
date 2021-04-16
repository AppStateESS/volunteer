<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\View;

use Canopy\Request;

class AdminView
{

    private static function menu(string $active = null)
    {
        $sponsorActive = null;
        $volunteerActive = null;
        $settingsActive = null;
        switch ($active) {
            case 'settings':
                $settingsActive = 'active';
                break;
            case 'sponsor':
                $sponsorActive = 'active';
                break;
            case 'volunteer':
                $volunteerActive = 'active';
                break;
        }
        $activeTpl = ['sponsorActive' => $sponsorActive, 'volunteerActive' => $volunteerActive, 'settingsActive' => $settingsActive];
        $template = new \phpws2\Template($activeTpl);
        $template->setModuleTemplate('volunteer', 'Menu.html');
        return $template->get();
    }

    public static function showMenu(string $active = null)
    {
        \Layout::plug(self::menu($active), 'NAV_LINKS');
    }

}
