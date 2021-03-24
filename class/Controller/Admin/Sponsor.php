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
        $search = $request->pullGetString('search', true);
        if ($search) {
            $options['search'] = $search;
        }

        return SponsorFactory::list($options);
    }

    protected function post(Request $request)
    {
        return ['success' => true, 'id' => SponsorFactory::post($request)];
    }

    protected function put(Request $request)
    {
        return ['success' => true, 'id' => SponsorFactory::put($request)];
    }

    protected function reportHtml(Request $request)
    {
        $sponsor = SponsorFactory::build($this->id);
        return SponsorView::scriptView('Report', ['sponsor' => $sponsor->getStringVars()]);
    }

}
