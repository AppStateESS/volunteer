<?php

/**
 * MIT License
 * Copyright (c) 2021 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Resource;

class Reason extends AbstractResource
{

    protected $title;
    protected $description;

    /**
     * If true, this reason will force an attended punch - they will not
     * need to punch out.
     * @var \phpws2\Variable\BooleanVar
     */
    protected $forceAttended;
    protected $table = 'vol_reason';

    public function __construct()
    {
        parent::__construct();
        $this->title = new \phpws2\Variable\TextOnly(null, 'title', 50);
        $this->title->allowEmpty(false);
        $this->description = new \phpws2\Variable\TextOnly(null, 'description', 255);
        $this->description->allowEmpty(false);
        $this->forceAttended = new \phpws2\Variable\BooleanVar(false, 'forceAttended');
    }

    public function setTitle($title)
    {
        $this->title->set(substr(trim($title), 0, 50));
    }

    public function setDescription($description)
    {
        $this->description->set(substr(trim($description), 0, 255));
    }

}
