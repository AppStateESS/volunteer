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

    /**
     *
     * @param int $id
     * @return \volunteer\Resource\Reason
     */
    public static function build(int $id = 0)
    {
        $reason = new Reason;
        return $id > 0 ? self::load($reason, $id) : $reason;
    }

    public static function assign(int $sponsorId, array $matchList)
    {
        if ($sponsorId === 0) {
            throw new \Exception('Null id received');
        }
        self::clearSponsor($sponsorId);
        /**
         * If empty, all matches were cleared by the above.
         */
        if (empty($matchList)) {
            return;
        }
        foreach ($matchList as $reasonId) {
            self::addMatch($sponsorId, $reasonId);
        }
    }

    public static function addMatch($sponsorId, $reasonId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_reasontosponsor');
        $tbl->addValue('sponsorId', $sponsorId);
        $tbl->addValue('reasonId', $reasonId);
        return $db->insert();
    }

    public static function clearSponsor(int $sponsorId)
    {
        if ($sponsorId === 0) {
            throw new \Exception('Null id received');
        }
        $db = Database::getDB();
        $tbl = $db->addTable('vol_reasontosponsor');
        $tbl->addFieldConditional('sponsorId', $sponsorId);
        return $db->delete();
    }

    public static function delete(int $reasonId)
    {
        if ($reasonId === 0) {
            throw new \Exception('Null id received');
        }
        self::removePunchReasons($reasonId);
        self::removeSponsorReasons($reasonId);
        $db = Database::getDB();
        $tbl = $db->addTable('vol_reason');
        $tbl->addFieldConditional('id', $reasonId);
        return $db->delete();
    }

    private static function removePunchReasons(int $reasonId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_punch');
        $tbl->addFieldConditional('reasonId', $reasonId);
        $tbl->addValue('reasonId', 0);
        return $db->update();
    }

    private static function removeSponsorReasons(int $reasonId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_reasontosponsor');
        $tbl->addFieldConditional('reasonId', $reasonId);
        return $db->delete();
    }

    public static function isForceAttended(int $reasonId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_reason');
        $tbl->addField('id');
        $tbl->addFieldConditional('id', $reasonId);
        $tbl->addFieldConditional('forceAttended', 1);
        return (bool) $db->selectColumn();
    }

    public static function listing(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_reason');
        if (!empty($options['sponsorId'])) {
            $reasonIdList = self::getSponsorReasonIds($options['sponsorId']);
            if (empty($reasonIdList)) {
                return null;
            } else {
                $tbl->addFieldConditional('id', $reasonIdList, 'in');
            }
        }
        if (!empty($options['sortBy']) && !empty($options['sortByDir'])) {
            $tbl->addOrderBy($options['sortBy'], $options['sortByDir']);
        } else {
            $tbl->addOrderBy('title');
        }
        $result = $db->select();
        if (!empty($options['sortById']) && !empty($result)) {
            foreach ($result as $row) {
                $sorted[$row['id']] = $row;
            }
            return $sorted;
        } else {
            return $result;
        }
    }

    public static function getSponsorReasonIds(int $sponsorId)
    {
        $result = [];
        $db = Database::getDB();
        $tbl = $db->addTable('vol_reasontosponsor');
        $tbl->addField('reasonId');
        $tbl->addFieldConditional('sponsorId', $sponsorId);
        while ($column = $db->selectColumn()) {
            $result[] = $column;
        }
        return $result;
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
