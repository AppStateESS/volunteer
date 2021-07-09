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

namespace volunteer\View;

use volunteer\Resource\Reason;
use volunteer\Factory\SponsorFactory;

class ReasonView extends AbstractView
{

    public static function listView()
    {
        return parent::scriptView('ReasonList');
    }

    public static function assign(int $sponsorId = 0)
    {
        return self::scriptView('AssignReason', ['sponsorId' => $sponsorId]);
    }

}
