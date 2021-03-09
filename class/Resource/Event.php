<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Resource;

class Event extends AbstractResource
{

    protected $sponsorId;
    protected $title;
    protected $date;
    protected $table = 'vol_event';

}
