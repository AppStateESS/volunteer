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
use Canopy\Request;

class Punch extends SubController
{

    protected function kioskHtml(Request $request)
    {
        return KioskView::scriptView('Kiosk', ['sponsor' => $GLOBALS['currentSponsor']]);
    }

    protected function swipeInJson(Request $request)
    {
        $bannerId = $request->pullGetString('bannerId');
        $sponsorId = $request->pullGetString('sponsorId');
        $volunteer = VolunteerFactory::loadByBannerId($bannerId);
        if (!$volunteer) {
            try {
                $volunteer = VolunteerFactory::createVolunteer($bannerId);
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
            PunchFactory::in($volunteer, $sponsorId);
            return ['success' => true, 'result' => 'in'];
        }
    }

}
