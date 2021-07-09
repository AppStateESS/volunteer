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

namespace volunteer\Controller\User;

use volunteer\Controller\SubController;
use volunteer\Factory\ReasonFactory;
use Canopy\Request;

class Reason extends SubController
{

    protected function listJson(Request $request)
    {
        $sponsorId = (int) $request->pullGetInteger('sponsorId', true);
        return ReasonFactory::listing(['sponsorId' => $sponsorId]) ?? [];
    }

}
