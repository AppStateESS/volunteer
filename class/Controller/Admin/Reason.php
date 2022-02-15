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

    protected function listJson(Request $request)
    {
        $sponsorId = (int) $request->pullGetInteger('sponsorId', true);
        $sortById = (int) $request->pullGetBoolean('sortById', true);
        $orderBy = $request->pullGetString('sortBy', true);
        $orderByDir = $request->pullGetString('sortDir', true);
        return ReasonFactory::listing(['sponsorId' => $sponsorId, 'sortById' => $sortById, 'orderBy' => $orderBy, 'orderByDir' => $orderByDir]) ?? [];
    }

    protected function delete(Request $request)
    {
        ReasonFactory::delete($this->id);
        return ['success' => true, 'id' => $this->id];
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

    protected function getSponsorReasonIdsJson(Request $request)
    {
        $sponsorId = (int) $request->pullGetInteger('sponsorId', true);
        $result = ReasonFactory::getSponsorReasonIds($sponsorId);
        return $result ? $result : [];
    }

    protected function assignHtml(Request $request)
    {
        AdminView::showMenu('reason');
        return ReasonView::assign($request->pullGetInteger('sponsorId', true));
    }

    protected function assignPost(Request $request)
    {
        ReasonFactory::assign($request->pullPostInteger('sponsorId'), $request->pullPostArray('matchList'));
        return ['success' => true];
    }

}
