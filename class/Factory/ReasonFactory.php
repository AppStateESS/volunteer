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

namespace volunteer\Factory;

use phpws2\Database;
use Canopy\Request;
use volunteer\Resource\Reason;

class ReasonFactory extends AbstractFactory
{

    public static function build(int $id = 0)
    {
        $reason = new Reason;
        return $id > 0 ? self::load($reason, $id) : $reason;
    }

    public static function listing()
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_reason');
        $tbl->addOrderBy('title');
        return $db->select();
    }

    public static function post(Request $request)
    {
        $reason = self::build();
        $reason->title = $request->pullPostString('title');
        $reason->description = $request->pullPostString('description');
        $reason->forceAttended = $request->pullPostBoolean('forceAttended');
        return $reason;
    }

    public static function put(Request $request)
    {
        $reason = self::build($request->pullPutInteger('id'));
        $reason->title = $request->pullPutString('title');
        $reason->description = $request->pullPutString('description');
        $reason->forceAttended = $request->pullPutBoolean('forceAttended');
        return $reason;
    }

}
