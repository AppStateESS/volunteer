<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\Admin;

use volunteer\Controller\SubController;
use volunteer\Factory\PunchFactory;
use Canopy\Request;

class Punch extends SubController
{

    protected function listJson(Request $request)
    {
        return PunchFactory::list(['sponsorId' => $request->pullGetInteger('sponsorId'), 'includeVolunteer' => true]);
    }

    protected function punchOutHtml(Request $request)
    {
        $volunteer = \volunteer\Factory\VolunteerFactory::build($request->pullGetInteger('volunteerId'));

        PunchFactory::out($volunteer, $this->id);
    }

    protected function reportJson(Request $request)
    {
        return PunchFactory::list(['volunteerId' => $request->pullGetInteger('volunteerId'), 'sortBySponsor' => true]);
    }

}
