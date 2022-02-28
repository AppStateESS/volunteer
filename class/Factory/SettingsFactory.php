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

    /**
     * Returns all settings.
     * @return type
     */
    public static function getAll()
    {
        $settingNames = [
            'contactEmail',
            'contactName',
            'quickLog',
            'contactEmail',
            'quickLogPreApproved',
            'allowQuickLogWithUnapproved'];

        foreach ($settingNames as $name) {
            $settings[$name] = self::get($name);
        }

        return $settings;
    }

    public static function get(string $setting)
    {
        return Settings::get('volunteer', $setting);
    }

    public static function set(string $name, $setting)
    {
        Settings::set('volunteer', $name, $setting);
    }

    /**
     * Returns a SwiftMailer ready reply-to address
     * @param bool $onlyNoReply If true, return the no-reply version
     * @return string
     */
    public static function getSwiftMailReply(bool $onlyNoReply = false)
    {
        $name = self::get('contactName') ?? \Layout::getPageTitle();
        $email = self::get('contactEmail');
        if ($onlyNoReply || empty($email)) {
            $email = 'noreply@' . \Canopy\Server::getSiteUrl(false, false, false);
        }

        return [$email => $name];
    }

    public static function getEmailAddressOnly()
    {
        return self::get('contactName') ?? \Layout::getPageTitle();
    }

}
