<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Factory;

use volunteer\Resource\Volunteer;
use phpws2\Database;

class SponsorFactory extends AbstractFactory
{

    public static function build(int $id = 0)
    {
        $volunteer = new Volunteer;
        return $id > 0 ? self::load($volunteer, $id) : $volunteer;
    }

    public static function list(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_sponsor');
        self::applyOptions($tbl, $options);
        return $db->select();
    }

}
