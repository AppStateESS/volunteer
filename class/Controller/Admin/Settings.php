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

}
