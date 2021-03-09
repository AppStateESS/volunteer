<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\Admin;

use volunteer\Controller\SubController;
use volunteer\View\VolunteerView;
use Canopy\Request;

class Volunteer extends SubController
{

    protected function listHtml(Request $request)
    {
        return VolunteerView::scriptView('Sponsor');
    }

}
