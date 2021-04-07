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

    protected function reportJson(Request $request)
    {
        return PunchFactory::list(['volunteerId' => $request->pullGetInteger('volunteerId'), 'sortBySponsor' => true]);
    }

    protected function punchOutPut(Request $request)
    {
        $punch = PunchFactory::build($this->id);
        PunchFactory::out($punch);
        return ['success' => true];
    }

}
