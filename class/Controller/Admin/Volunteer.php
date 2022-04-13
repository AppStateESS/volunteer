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

    protected function emailHtml()
    {
        AdminView::showMenu('volunteer');
        return VolunteerView::email($this->id);
    }

    protected function sendSponsorEmailsPut(Request $request)
    {
        VolunteerFactory::sendEmails($this->id, $request->pullPutArray('sponsorIds'));
    }

    protected function listHtml(Request $request)
    {
        AdminView::showMenu('volunteer');
        return VolunteerView::list();
    }

    protected function listJson(Request $request)
    {
        $options = VolunteerFactory::listingOptions($request);
        if (empty($options['limit'])) {
            $options['limit'] = 50;
        }
        $options['orderBy'] = $request->pullGetString('sortBy', true);
        $options['orderByDir'] = $request->pullGetString('sortDir', true);
        if (empty($options['orderBy'])) {
            $options['orderBy'] = 'lastLog';
            $options['orderByDir'] = 'desc';
        }
        return VolunteerFactory::list($options);
    }

    protected function refreshPatch()
    {
        VolunteerFactory::refresh($this->id);
        return ['success' => true];
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
