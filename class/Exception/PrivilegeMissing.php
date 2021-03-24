<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Exception;

class PrivilegeMissing extends \Exception
{

    public function __construct()
    {
        $this->message = 'User does not have permissions for this action.';
    }

}
