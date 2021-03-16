<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\View;

use volunteer\Factory\PunchFactory;
use volunteer\Factory\VolunteerFactory;

class PunchView extends AbstractView
{

    public static function punchButton()
    {
        $currentVolunteer = VolunteerFactory::loadCurrent();
        //$punchStatus = PunchFactory::punchStatus();
    }

}
