<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\Admin;

use volunteer\Controller\SubController;
use volunteer\View\SettingsView;
use volunteer\Factory\SettingsFactory;
use Canopy\Request;

class Settings extends SubController
{

    protected static function listHtml()
    {
        return SettingsView::form();
    }

    protected static function post(Request $request)
    {
        $settingName = $request->pullPostString('name');
        $settingValue = $request->pullPostString('value');
        SettingsFactory::save($settingName, $settingValue);
        return ['success' => true];
    }

}
