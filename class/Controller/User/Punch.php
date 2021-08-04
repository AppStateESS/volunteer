<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\User;

use volunteer\Controller\SubController;
use volunteer\View\KioskView;
use volunteer\Factory\VolunteerFactory;
use volunteer\Factory\PunchFactory;
use volunteer\Factory\SponsorFactory;
use volunteer\Factory\ReasonFactory;
use Canopy\Request;

class Punch extends SubController
{

    protected function kioskHtml(Request $request)
    {
        if (\Current_User::allow('volunteer')) {
            \volunteer\View\AdminView::showMenu();
        }
        return KioskView::scriptView('Kiosk', ['sponsor' => $GLOBALS['currentSponsor']]);
    }

    protected function clockInReasonPost(Request $request)
    {
        $sponsorId = $request->pullPostInteger('sponsorId');
        $volunteerId = $request->pullPOstInteger('volunteerId');
        $reasonId = $request->pullPostInteger('reasonId');
        $volunteer = VolunteerFactory::build($volunteerId);
        $reason = ReasonFactory::build($reasonId);
        PunchFactory::in($volunteer, $sponsorId, $reasonId);
        return ['success' => true, 'attendanceOnly' => $reason->forceAttended];
    }

    protected function swipeInJson(Request $request)
    {
        $studentBannerId = $request->pullGetString('studentBannerId');
        $sponsorId = $request->pullGetString('sponsorId');
        $includeReasons = $request->pullGetBoolean('includeReasons');

        $volunteer = VolunteerFactory::loadByBannerId($studentBannerId);
        if (!$volunteer) {
            try {
                $volunteer = VolunteerFactory::createStudent($studentBannerId);
            } catch (\volunteer\Exception\StudentNotFound $e) {
                return ['success' => false, 'result' => 'notfound'];
            }
        }
        return PunchFactory::punchReply($volunteer, $sponsorId, $includeReasons);
    }

}
