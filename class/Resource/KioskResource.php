<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Resource;

class KioskResource extends AbstractResource
{

    /**
     * @var \phpws2\Variable\IntegerVar
     */
    protected $sponsorId;

    /**
     * @var \phpws2\Variable\StringVar
     */
    protected $ipAddress;
    protected $table = 'vol_kiosk';

    public function __construct()
    {
        parent::__construct();
        $this->sponsorId = new \phpws2\Variable\IntegerVar(0, 'sponsorId');
        $this->ipAddress = new \phpws2\Variable\StringVar('0.0.0.0', 'ipAddress', 24);
        $this->ipAddress->setRegexpMatch('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/');
    }

}
