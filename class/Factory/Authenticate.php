<?php

/**
 * This is written strictly for Shibboleth. Should authentication change in some manner it will
 * need to be reworked.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Factory;

class Authenticate
{

    public static function isLoggedIn()
    {
        return isset($_SERVER[VOL_SHIB_USERNAME_TAG]);
    }

    public static function getLoginUsername()
    {
        return str_ireplace(VOL_SHIB_DOMAIN, '', $_SERVER[VOL_SHIB_USERNAME_TAG]);
    }

    public static function sendToLogin()
    {
        \Canopy\Server::forward(PHPWS_HOME_HTTP . '/secure');
    }

}
