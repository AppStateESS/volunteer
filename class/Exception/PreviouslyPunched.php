<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Exception;

class PreviouslyPunched extends \Exception
{

    public function __construct()
    {
        $this->message = 'Student previously punched out';
    }

}
