<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Resource;

class Punch extends AbstractResource
{

    protected $volunteerId;
    protected $sponsorId;
    protected $eventId;
    protected $timeIn;
    protected $timeOut;
    protected $table = 'vol_punch';

}
