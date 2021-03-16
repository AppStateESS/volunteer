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

    public function __construct()
    {
        parent::__construct();
        $this->sponsorId = new \phpws2\Variable\IntegerVar(0, 'sponsorId');
        $this->title = new \phpws2\Variable\TextOnly(null, 'title', 255);
        $this->date = new \phpws2\Variable\DateTime(0, 'date');
    }

}
