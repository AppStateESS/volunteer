<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\Admin;

use Canopy\Request;
use volunteer\Controller\SubController;
use volunteer\View\LogView;
use volunteer\View\AdminView;

class Log extends SubController
{

    protected function listHtml(Request $request)
    {
        $sponsorId = $request->pullGetInteger('sponsorId', true);
        $volunteerId = $request->pullGetInteger('volunteerId', true);
        if ($sponsorId) {
            AdminView::showMenu('sponsor');
            return LogView::sponsor($sponsorId);
        } elseif ($volunteerId) {
            AdminView::showMenu('volunteer');
            return LogView::volunteer($volunteerId);
        } else {
            throw new \Exception('Unknown log type');
        }
    }

}
