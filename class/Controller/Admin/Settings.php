<?php

declare(strict_types=1);
/**
 * MIT License
 * Copyright (c) 2022 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\Admin;

use Canopy\Request;
use volunteer\Controller\SubController;
use volunteer\View\SettingsView;
use volunteer\View\AdminView;
use volunteer\Factory\SettingsFactory;

class Settings extends SubController
{

    protected function listHtml()
    {
        AdminView::showMenu('settings');
        return SettingsView::form();
    }

    protected function post(Request $request)
    {
        $varName = $request->pullPostString('name');
        $value = $request->pullPostVar('value');
        SettingsFactory::set($varName, $value);
    }

}
