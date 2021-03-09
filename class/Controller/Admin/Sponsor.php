<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\Admin;

use volunteer\Controller\SubController;
use volunteer\View\SponsorView;
use volunteer\Factory\SponsorFactory;
use Canopy\Request;

class Sponsor extends SubController
{

    protected function listHtml(Request $request)
    {
        return SponsorView::scriptView('Sponsor');
    }

    protected function listJson(Request $request)
    {
        $options = [];
        return SponsorFactory::list($options);
    }

}
