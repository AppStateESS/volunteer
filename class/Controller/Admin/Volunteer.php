<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\Admin;

use volunteer\Controller\SubController;
use volunteer\View\VolunteerView;
use volunteer\View\AdminView;
use volunteer\Factory\VolunteerFactory;
use volunteer\Exception\ResourceNotFound;
use Canopy\Request;

class Volunteer extends SubController
{

    protected function listHtml(Request $request)
    {
        AdminView::showMenu('volunteer');
        return VolunteerView::list();
    }

    protected function listJson(Request $request)
    {
        return VolunteerFactory::list(VolunteerFactory::listingOptions($request));
    }

    protected function reportHtml(Request $request)
    {
        AdminView::showMenu('volunteer');
        try {
            $volunteer = VolunteerFactory::build($this->id);
        } catch (ResourceNotFound $e) {
            return '<p>Volunteer not found. <a href="volunteer/Admin/Volunteer/">Return to list</a></p>';
        }

        return VolunteerView::report($volunteer);
    }

}
