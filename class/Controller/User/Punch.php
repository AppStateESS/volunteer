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
        $sponsor = SponsorFactory::build($sponsorId);
        $volunteer = VolunteerFactory::loadByBannerId($studentBannerId);
        if (!$volunteer) {
            try {
                $volunteer = VolunteerFactory::createVolunteer($studentBannerId);
            } catch (\volunteer\Exception\StudentNotFound $e) {
                return ['success' => false, 'result' => 'notfound'];
            }
        }

        $punch = PunchFactory::currentPunch($volunteer);

        if ($punch) {
            if ((int) $punch->sponsorId !== (int) $sponsorId) {
                return ['success' => false, 'result' => 'punchedInElsewhere'];
            } else {
                PunchFactory::out($punch);
                return ['success' => true, 'result' => 'out'];
            }
        } else {
            if ($sponsor->useReasons) {
                /* Error check to prevent blank reason page */
                $reasons = ReasonFactory::listing(['sponsorId' => $sponsor->id]);
                if (empty($reasons)) {
                    PunchFactory::in($volunteer, $sponsorId);
                    return ['success' => true, 'result' => 'in', 'reasons' => []];
                } else {
                    return ['success' => true, 'result' => 'reason', 'reasons' => $reasons, 'volunteerId' => $volunteer->id];
                }
            } else {
                PunchFactory::in($volunteer, $sponsorId);
                return ['success' => true, 'result' => 'in', 'reasons' => []];
            }
        }
    }

}
