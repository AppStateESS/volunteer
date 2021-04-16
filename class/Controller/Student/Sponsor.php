<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\Student;

use volunteer\Controller\SubController;
use volunteer\View\SponsorView;
use volunteer\Factory\SponsorFactory;
use Canopy\Request;

class Sponsor extends SubController
{

    protected function listJson(Request $request)
    {
        return SponsorFactory::list(['noKiosk' => true]);
    }

}
