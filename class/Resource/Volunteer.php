<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Resource;

class Volunteer extends AbstractResource
{

    protected $userName;
    protected $bannerId;
    protected $firstName;
    protected $preferredName;
    protected $lastName;
    protected $table = 'vol_volunteer';

    public function __construct()
    {
        parent::__construct();
        $this->userName = new \phpws2\Variable\StringVar(null, 'userName', 50);
        $this->bannerId = new \phpws2\Variable\NumberString(null, 'bannerId', 20);
        $this->firstName = new \phpws2\Variable\TextOnly(null, 'firstName', 40);
        $this->preferredName = new \phpws2\Variable\TextOnly(null, 'preferredName', 40);
        $this->preferredName->allowNull(true);
        $this->lastName = new \phpws2\Variable\TextOnly(null, 'lastName', 40);
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

}
