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

namespace volunteer\Controller\Admin;

use volunteer\Controller\SubController;
use volunteer\View\ReasonView;
use volunteer\Factory\ReasonFactory;
use volunteer\View\AdminView;
use Canopy\Request;

class Reason extends SubController
{

    protected function listHtml()
    {
        AdminView::showMenu('reason');
        return ReasonView::listView();
    }

    protected function listJson()
    {
        return ReasonFactory::listing() ?? [];
    }

    protected function post(Request $request)
    {
        $reason = ReasonFactory::post($request);
        $reasonId = ReasonFactory::save($reason);
        return ['success' => true, 'id' => $reasonId];
    }

    protected function put(Request $request)
    {
        $reason = ReasonFactory::put($request);
        $reasonId = ReasonFactory::save($reason);
        return ['success' => true, 'id' => $reasonId];
    }

}
