<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\Admin;

use volunteer\Controller\SubController;
use volunteer\View\SponsorView;
use volunteer\View\AdminView;
use volunteer\Factory\SponsorFactory;
use Canopy\Request;

class Sponsor extends SubController
{

    protected function listHtml(Request $request)
    {
        AdminView::showMenu('sponsor');
        return SponsorView::scriptView('Sponsor');
    }

    protected function listJson(Request $request)
    {
        return SponsorFactory::list(SponsorFactory::listingOptions($request));
    }

    protected function post(Request $request)
    {
        return ['success' => true, 'id' => SponsorFactory::post($request)];
    }

    protected function put(Request $request)
    {
        return ['success' => true, 'id' => SponsorFactory::put($request)];
    }

    protected function reportHtml(Request $request)
    {
        AdminView::showMenu();
        $sponsor = SponsorFactory::build($this->id);
        return SponsorView::scriptView('Report', ['sponsor' => $sponsor->getStringVars()]);
    }

    protected function kioskPatch(Request $request)
    {
        $sponsor = SponsorFactory::build($this->id);
        $sponsor->kioskMode = $request->pullPatchBoolean('kioskMode');
        SponsorFactory::save($sponsor);
        return ['success' => true];
    }

    protected function preApprovedPatch(Request $request)
    {
        $sponsor = SponsorFactory::build($this->id);
        $sponsor->preApproved = $request->pullPatchBoolean('preApproved');
        SponsorFactory::save($sponsor);
        return ['success' => true];
    }

}
