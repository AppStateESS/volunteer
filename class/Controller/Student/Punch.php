<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\Student;

use volunteer\Controller\SubController;
use volunteer\Factory\PunchFactory;
use volunteer\Factory\VolunteerFactory;
use volunteer\View\PunchView;
use Canopy\Request;

class Punch extends SubController
{

    protected function inPost(Request $request)
    {
        $punchId = PunchFactory::in(VolunteerFactory::loadCurrent(),
                        $request->pullPostInteger('sponsorId'));
        \Canopy\Server::forward('volunteer/Student/Punch/' . $punchId . '/punchedIn');
        return PunchView::afterPunchIn();
    }

    protected function outPost(Request $request)
    {
        try {
            $punch = PunchFactory::build($request->pullPostInteger('punchId'));

            $volunteer = VolunteerFactory::loadCurrent();
            if ($punch->volunteerId !== $volunteer->id) {
                throw new \Exception('Volunteer does not match punch');
            }
            PunchFactory::out($punch);
        } catch (\volunteer\Exception\PreviouslyPunched $ex) {
            return PunchView::previouslyPunched();
        }
        return PunchView::afterPunchOut();
    }

    protected function punchedInHtml(Request $request)
    {
        return PunchView::afterPunchIn($this->id);
    }

}
