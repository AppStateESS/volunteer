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
use volunteer\Factory\PunchFactory;
use volunteer\Factory\LogFactory;
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
        return VolunteerView::scriptView('PunchListing',
                        ['volunteerId' => $this->id, 'sponsorId' => 0]);
    }

    protected function viewJson(Request $request)
    {
        $volunteer = VolunteerFactory::build($this->id);
        return $volunteer->getStringVars();
    }

    protected function delete(Request $request)
    {
        VolunteerFactory::delete($this->id);
        PunchFactory::deleteByVolunteerId($this->id);
        LogFactory::deleteByVolunteerId($this->id);
        return ['success' => true];
    }

}
