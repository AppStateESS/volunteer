<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Role;

class Student extends Base
{

    public function isStudent()
    {
        return true;
    }

}
