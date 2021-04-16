<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\View;

use volunteer\Factory\SettingsFactory;

class SettingsView extends AbstractView
{

    public static function form()
    {
        return parent::scriptView('Settings', ['currentSettings' => SettingsFactory::getAll()]);
    }

}
