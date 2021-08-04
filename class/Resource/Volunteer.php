<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Resource;

class Volunteer extends AbstractResource
{

    protected $userName;
    protected $email;
    protected $bannerId;
    protected $firstName;
    protected $preferredName;
    protected $lastName;
    protected $lastLog;
    protected $totalVisits;
    protected $table = 'vol_volunteer';

    public function __construct()
    {
        parent::__construct();
        $this->userName = new \phpws2\Variable\StringVar(null, 'userName', 50);
        $this->userName->allowNull(true);
        $this->email = new \phpws2\Variable\Email(null, 'email', 100);
        $this->bannerId = new \phpws2\Variable\NumberString('0', 'bannerId', 20);
        $this->bannerId->allowNull(true);
        $this->firstName = new \phpws2\Variable\TextOnly(null, 'firstName', 40);
        $this->preferredName = new \phpws2\Variable\TextOnly(null, 'preferredName', 40);
        $this->preferredName->allowNull(true);
        $this->lastName = new \phpws2\Variable\TextOnly(null, 'lastName', 40);
        $this->totalVisits = new \phpws2\Variable\IntegerVar(0, 'totalVisits');
        $this->lastLog = new \phpws2\Variable\DateTime(0, 'lastLog');
        $this->lastLog->setFormat('%c');
    }

    public function getFullName()
    {
        if ($this->preferredName->isEmpty()) {
            return "{$this->firstName} {$this->lastName}";
        } else {
            return "{$this->preferredName} {$this->lastName}";
        }
    }

    public function getPreferred()
    {
        return $this->preferredName->isEmpty() ? $this->firstName->get() : $this->preferredName->get();
    }

    public function stampVisit()
    {
        $this->lastLog->stamp();
        $this->totalVisits->increase();
    }

}
