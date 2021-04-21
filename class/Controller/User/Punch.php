<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\User;

use volunteer\Controller\SubController;
use volunteer\View\KioskView;
use Canopy\Request;

class Punch extends SubController
{

    protected function kioskHtml(Request $request)
    {
        return KioskView::scriptView('Kiosk', ['sponsor' => $GLOBALS['currentSponsor']]);
    }

}
