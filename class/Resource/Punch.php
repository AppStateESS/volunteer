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
    protected $approved;
    protected $attended;
    protected $table = 'vol_punch';

    public function __construct()
    {
        parent::__construct();
        $this->volunteerId = new \phpws2\Variable\IntegerVar(0, 'volunteerId');
        $this->sponsorId = new \phpws2\Variable\IntegerVar(0, 'sponsorId');
        $this->eventId = new \phpws2\Variable\IntegerVar(0, 'eventId');
        $this->timeIn = new \phpws2\Variable\IntegerVar(0, 'timeIn');
        $this->timeOut = new \phpws2\Variable\IntegerVar(0, 'timeOut');
        $this->approved = new \phpws2\Variable\BooleanVar(0, 'approved');
        $this->attended = new \phpws2\Variable\BooleanVar(0, 'attended');
    }

    public function in()
    {
        $this->timeIn->set(time());
    }

    public function out()
    {
        $this->timeOut->set(time());
    }

}
