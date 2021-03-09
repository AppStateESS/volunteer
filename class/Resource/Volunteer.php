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
        $this->userName = new \phpws2\Variable\StringVar(null, 'userName');
        $this->bannerId = new \phpws2\Variable\Alphanumeric(null, 'bannerId');
        $this->firstName = new \phpws2\Variable\Alphanumeric(null, 'firstName');
        $this->preferredName = new \phpws2\Variable\Alphanumeric(null, 'preferredName');
        $this->lastName = new \phpws2\Variable\Alphanumeric(null, 'lastName');
    }

}
