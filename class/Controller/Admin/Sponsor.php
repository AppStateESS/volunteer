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

    protected function viewJson(Request $request)
    {
        if ($this->id === 0) {
            return null;
        }
        $sponsor = SponsorFactory::build($this->id);
        return $sponsor->getStringVars();
    }

    protected function delete(Request $request)
    {
        SponsorFactory::delete($this->id);
        return['success' => true, 'id' => $this->id];
    }

    protected function post(Request $request)
    {
        return ['success' => true, 'id' => SponsorFactory::post($request)];
    }

    protected function put(Request $request)
    {
        return ['success' => true, 'id' => SponsorFactory::put($request)];
    }

    protected function qrCodeHtml(Request $request)
    {
        AdminView::showMenu('sponsor');
        return SponsorView::qrCode($this->id);
    }

    protected function reportHtml(Request $request)
    {
        AdminView::showMenu('sponsor');
        return SponsorView::scriptView('PunchListing',
                ['volunteerId' => 0, 'sponsorId' => $this->id]);
    }

    protected function waitingHtml()
    {
        AdminView::showMenu('sponsor');

        return SponsorView::scriptView('Waiting',
                ['sponsorId' => (int) $this->id]);
    }

    protected function kioskPatch(Request $request)
    {
        SponsorFactory::patchValue('kioskMode', $request->pullPatchBoolean('kioskMode'), $this->id);
        return ['success' => true];
    }

    protected function preApprovedPatch(Request $request)
    {
        SponsorFactory::patchValue('preApproved', $request->pullPatchBoolean('preApproved'), $this->id);
        return ['success' => true];
    }

    protected function useReasonsPatch(Request $request)
    {
        SponsorFactory::patchValue('useReasons', $request->pullPatchBoolean('useReasons'), $this->id);
        return ['success' => true];
    }

    protected function attendancePatch(Request $request)
    {
        SponsorFactory::patchValue('attendanceOnly', $request->pullPatchBoolean('attendanceOnly'), $this->id);
        return ['success' => true];
    }

    protected function defaultPatch(Request $request)
    {
        SponsorFactory::updateDefault($this->id);
        return ['success' => true];
    }

}
