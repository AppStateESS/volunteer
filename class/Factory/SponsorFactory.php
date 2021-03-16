<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Factory;

use volunteer\Resource\Sponsor;
use phpws2\Database;
use Canopy\Request;

class SponsorFactory extends AbstractFactory
{

    public static function build(int $id = 0)
    {
        $sponsor = new Sponsor;
        return $id > 0 ? self::load($sponsor, $id) : $sponsor;
    }

    public static function list(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_sponsor');
        if (empty($options['orderBy'])) {
            $options['orderBy'] = 'name';
            $options['dir'] = 1;
        }
        self::applyOptions($db, $tbl, $options);
        return $db->select();
    }

    public static function post(Request $request)
    {
        $sponsor = self::build();
        $sponsor->name = $request->pullPostString('name');
        return self::save($sponsor);
    }

    public static function put(Request $request)
    {
        $sponsor = self::build($request->pullPutInteger('id'));
        $sponsor->name = $request->pullPutString('name');
        return self::save($sponsor);
    }

}
