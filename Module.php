<?php

/**
 * MIT License
 * Copyright (c) 2021 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer;

use Canopy\Request;
use Canopy\Response;
use Canopy\Server;
use Canopy\SettingDefaults;
use volunteer\Controller\Controller;
use volunteer\Factory\MemberFactory;
use volunteer\Factory\Authenticate;

$defineFile = PHPWS_SOURCE_DIR . 'mod/volunteer/config/defines.php';
if (is_file($defineFile)) {
    require_once $defineFile;
} else {
    require_once PHPWS_SOURCE_DIR . 'mod/volunteer/config/defines.dist.php';
}

class Module extends \Canopy\Module implements SettingDefaults
{

    public function __construct()
    {
        parent::__construct();
        $this->setTitle('volunteer');
        $this->setProperName('Volunteer Tracker');
        \spl_autoload_register('\volunteer\Module::autoloader', true, true);
    }

    public static function autoloader($class_name)
    {
        static $not_found = array();

        if (strpos($class_name, 'volunteer') !== 0) {
            return;
        }

        if (isset($not_found[$class_name])) {
            return;
        }
        $class_array = explode('\\', $class_name);
        $shifted = array_shift($class_array);
        $class_dir = implode('/', $class_array);

        $class_path = PHPWS_SOURCE_DIR . 'mod/volunteer/class/' . $class_dir . '.php';

        if (is_file($class_path)) {
            require_once $class_path;
            return true;
        } else {
            $not_found[] = $class_name;
            return false;
        }
    }

    public function getSettingDefaults()
    {
        $settings = [];
        return $settings;
    }

    public function runTime(Request $request)
    {
        if (\phpws\PHPWS_Core::atHome()) {
            if (Authenticate::isLoggedIn()) {
                \Layout::add('Clock in out button', 'volunteer', 'volunteer-create');
            } else {
                \Layout::add('Volunteer log in button', 'volunteer', 'volunteer-create');
            }
        }
    }

    public static function loadAdminBar()
    {
        $auth = \Current_User::getAuthorization();

        $vars['is_deity'] = \Current_User::isDeity();
        $vars['logout_uri'] = $auth->logout_link;
        $vars['username'] = \Current_User::getDisplayName();
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('volunteer', 'navbar.html');
        $content = $template->get();
        \Layout::plug($content, 'NAV_LINKS');
    }

    public function getController(Request $request)
    {
        try {
            $controller = new Controller($this, $request);
            return $controller;
        } catch (\volunteer\Exception\PrivilegeMissing $e) {
            if ($request->isGet() && !$request->isAjax()) {
                \Current_User::requireLogin();
            } else {
                throw $e;
            }
        } catch (\Exception $e) {
            if (VOLUNTEER_SYSTEM_SETTINGS['friendlyErrors']) {
                \phpws2\Error::log($e);
                $controller = new \volunteer\Controller\FriendlyErrorController($this);
                return $controller;
            } else {
                throw $e;
            }
        }
    }

}
