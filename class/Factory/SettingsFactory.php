<?php

/**
 * MIT License
 * Copyright (c) 2019 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Factory;

use phpws2\Database;
use phpws2\Settings;

class SettingsFactory
{

    public static function getAll()
    {
        $settings = [];
        $settings['approvalRequired'] = (bool) self::get('approvalRequired');
        $settings['kioskMode'] = (bool) self::get('kioskMode');

        return $settings;
    }

    public static function get($setting)
    {
        return Settings::get('volunteer', $setting);
    }

    /**
     * Returns a SwiftMailer ready reply-to address
     * @param bool $onlyNoReply If true, return the no-reply version
     * @return string
     */
    public static function getSwiftMailReply(bool $onlyNoReply = false)
    {
        $contact = self::getContact();
        if ($onlyNoReply || empty($contact['email'])) {
            $contact['email'] = 'noreply@' . \Canopy\Server::getSiteUrl(false, false, false);
        }

        if ($onlyNoReply || empty($contact['name'])) {
            return [$contact['email']];
        } else {
            return [$contact['email'] => $contact['name']];
        }
    }

    public static function getEmailAddressOnly()
    {
        $contact = self::getContact();
        if (empty($contact['email'])) {
            return 'noreply@' . \Canopy\Server::getSiteUrl(false, false, false);
        } else {
            return $contact['email'];
        }
    }

    public static function save(string $varName, $value)
    {
        switch ($varName) {
            case 'approvalRequired':
            case 'kioskMode':
                Settings::set('volunteer', $varName, (bool) $value);
                break;

            case 'stringsetting':
                Settings::set('volunteer', $varName, filter_var($value, FILTER_SANITIZE_STRING));
                break;

            default:
                throw new \Exception('Unknown setting');
        }
    }

}
