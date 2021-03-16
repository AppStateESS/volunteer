<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Exception;

class StudentNotFound extends \Exception
{

    public function __construct($username)
    {
        $this->message = 'Student not found: ' . $username;
    }

}
