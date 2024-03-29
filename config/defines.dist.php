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
/**
 * Do not change the below unless developing
 */
define('VOLUNTEER_SYSTEM_SETTINGS',
    [
        'productionMode' => true,
        'friendlyErrors' => true
    ]);

define('VOLUNTEER_BANNER_API', '');

define('VOLUNTEER_TIMEOUT', 8);

define('VOL_SHIB_DOMAIN', ''); // @university.edu
define('VOL_SHIB_LOGOUT_TAG', '');
define('VOL_SHIB_USERNAME_TAG', ''); // name of SERVER variable containing the username
define('VOL_CONTACT_EMAIL', '');
define('VOL_USE_PREFERRED_ON_REPORT', true);
define('VOLUNTEER_SWIFT_OLD_VERSION', true);
