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
    protected $searchName;
    protected $table = 'vol_sponsor';

    public function __construct()
    {
        parent::__construct();
        $this->name = new \phpws2\Variable\TextOnly(null, 'name', 50);
        $this->searchName = new \phpws2\Variable\TextOnly(null, 'searchName', 50);
    }

    public function setName($name)
    {
        $this->name->set($name);
        $this->buildSearchName();
    }

    private function buildSearchName()
    {
        $this->searchName->set(preg_replace('/[^\w\-]/', '',
                        strtolower(preg_replace('/\s+/', '-', $this->name->get()))));
    }

}
