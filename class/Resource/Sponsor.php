<?php

/**
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Resource;

class Sponsor extends AbstractResource
{

    protected $name;
    protected $table = 'vol_sponsor';

    public function __construct()
    {
        parent::__construct();
        $this->name = new \phpws2\Variable\TextOnly(null, 'name', 50);
    }

}
