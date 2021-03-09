<?php

/**
 * MIT License
 * Copyright (c) 2020 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Factory;

use volunteer\Exception\ResourceNotFound;
use Canopy\Request;
use phpws2\Database\Table;

/**
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
abstract class AbstractFactory extends \phpws2\ResourceFactory
{

    /**
     *
     * @param int $id
     * @param type $throwException
     * @return Resource
     * @throws ResourceNotFound
     */
    public static function load($resource, $id, $throwException = true)
    {
        $resource->setId($id);
        if (!parent::loadByID($resource)) {
            if ($throwException) {
                throw new ResourceNotFound($id);
            } else {
                return null;
            }
        }
        return $resource;
    }

    public static function save(\phpws2\Resource $resource)
    {
        return self::saveResource($resource);
    }

    protected static function addSearch(string $searchPhrase, array $columns,
            \phpws2\Database\DB $db, \phpws2\Database\Table $tbl)
    {
        foreach ($columns as $c) {
            $cond = $db->createConditional($tbl->getField($c), '%' . $searchPhrase . '%', 'like');
            if (isset($prevCond)) {
                $prevCond = $db->createConditional($cond, $prevCond, 'or');
            } else {
                $prevCond = $cond;
            }
        }
        $db->addConditional($prevCond);
    }

    protected static function applyOptions(Table $tbl, array $options)
    {
        if (!empty($options['orderBy'])) {
            $orderBy = $options['orderBy'];
            if (isset($options['dir'])) {
                $direction = (int) $options['dir'] ? 'asc' : 'desc';
            } else {
                $direction = 'asc';
            }
            $tbl->addOrderBy($orderBy, $direction);
        }
    }

    public static function listingOptions(Request $request)
    {
        $options['search'] = $request->pullGetString('search', true);
        $options['sortBy'] = $request->pullGetString('sortBy', true);
        $options['sortByDir'] = $request->pullGetString('sortByDir', true);
        $options['limit'] = $request->pullGetString('limit', true);
        $options['offset'] = $request->pullGetString('offset', true);
        return $options;
    }

}
