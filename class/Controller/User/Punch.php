<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\User;

use volunteer\Controller\SubController;
use volunteer\View\KioskView;
use volunteer\View\PunchView;
use volunteer\View\SponsorView;
use volunteer\Factory\VolunteerFactory;
use volunteer\Factory\PunchFactory;
use volunteer\Factory\SponsorFactory;
use volunteer\Factory\ReasonFactory;
use volunteer\Factory\SettingsFactory;
use Canopy\Request;

class Punch extends SubController
{

    protected function afterHtml(Request $request)
    {
        return PunchView::afterQuickPunch($request->pullGetString('hash'), $request->pullGetString('searchName'));
    }

    protected function kioskHtml(Request $request)
    {
        if (\Current_User::allow('volunteer')) {
            \volunteer\View\AdminView::showMenu();
        }
        return KioskView::scriptView('Kiosk', ['sponsor' => $GLOBALS['currentSponsor']]);
    }

    protected function logInHtml(Request $request)
    {
        return \volunteer\View\VolunteerView::logInPrompt();
    }

    protected function quickPost(Request $request)
    {
        $volunteer = VolunteerFactory::getByHash($request->pullPostString('hash'));
        if (empty($volunteer)) {
            return PunchView::noMatchingHash($sponsor);
        }
        $currentPunch = PunchFactory::currentPunch($volunteer);

        if ($currentPunch) {
            $sponsorId = $currentPunch->sponsorId;
            $sponsor = SponsorFactory::build($sponsorId);
            PunchFactory::out($currentPunch);
        } else {
            $sponsorId = $request->pullPostInteger('sponsorId', true);
            if (empty($sponsorId)) {
                return SponsorView::badSponsorError();
            }
            $sponsor = SponsorFactory::build($sponsorId);
            if (!$sponsor->quickLog) {
                return PunchView::noQuickLog($sponsor);
            }
            $reasonId = $request->pullPostInteger('reasonId', true);

            PunchFactory::in($volunteer, $sponsorId, $reasonId);
        }
        \Canopy\Server::forward("./volunteer/User/Punch/after?searchName={$sponsor->searchName}&hash={$volunteer->hash}");
    }

    protected function quickHtml(Request $request)
    {
        $hash = $request->pullGetString('hash');
        /**
         * @var array
         */
        /**
         * @var Resource/Volunteer
         */
        $sponsor = $GLOBALS['currentSponsor'];
        $volunteer = VolunteerFactory::getByHash($hash);
        /**
         * If volunteer hash doesn't match, send message.
         */
        if (empty($volunteer)) {
            return PunchView::noMatchingHash($sponsor);
        }

        $preApproved = SettingsFactory::get('quickLogPreApproved');

        /**
         * If quick log not enabled, send message.
         */
        if (!$sponsor['quickLog']) {
            return PunchView::noQuickLog($sponsor);
        }

        /**
         * Get the current punch. If it is using the current sponsor, clock them
         * out.
         */
        $punch = PunchFactory::currentPunch($volunteer);
        if ($punch && (int) $punch->sponsorId === (int) $sponsor['id']) {
            return PunchView::quickPunchOut($hash, $volunteer, $punch);
        } else {
            return PunchView::quickPunchIn($hash, $volunteer, $sponsor['id']);
        }
    }

    protected function clockInReasonPost(Request $request)
    {
        $sponsorId = $request->pullPostInteger('sponsorId');
        $volunteerId = $request->pullPostInteger('volunteerId');
        $reasonId = $request->pullPostInteger('reasonId');
        $volunteer = VolunteerFactory::build($volunteerId);
        $volunteerName = $volunteer->getPreferred();
        $reason = ReasonFactory::build($reasonId);
        PunchFactory::in($volunteer, $sponsorId, $reasonId);
        return ['success' => true, 'attendanceOnly' => $reason->forceAttended, 'volunteerId' => $volunteerId, 'volunteerName' => $volunteerName];
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
