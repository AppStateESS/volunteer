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
        if (!empty($options['idList'])) {
            $tbl->addFieldConditional('id', $options['idList'], 'in');
        }
        self::applyOptions($db, $tbl, $options, ['name']);
        if (!empty($options['noKiosk'])) {
            $tbl->addFieldConditional('kioskMode', 0);
        }
        $result = $db->select();
        if (empty($result)) {
            return [];
        }
        if (!empty($options['sortById'])) {
            foreach ($result as $row) {
                $sorted[$row['id']] = $row;
            }
            return $sorted;
        } else {
            return $result;
        }
    }

    public static function isPreapproved(int $sponsorId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_sponsor');
        $tbl->addFieldConditional('id', $sponsorId);
        $tbl->addField('preApproved');
        return (bool) $db->selectColumn();
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

    public static function pullByName(string $name)
    {
        $searchName = strtolower($name);
        $db = Database::getDB();
        $tbl = $db->addTable('vol_sponsor');
        $tbl->addFieldConditional('searchName', $searchName);
        $vars = $db->selectOneRow();
        if (empty($vars)) {
            return false;
        } else {
            $sponsor = self::build();
            $sponsor->setVars($vars);
            return $sponsor;
        }
    }

    public static function save(\phpws2\Resource $sponsor)
    {
        parent::save($sponsor);
        self::saveShortcut($sponsor);
        return $sponsor->id;
    }

    private static function saveShortcut(Sponsor $sponsor)
    {
        $url = 'volunteer:' . $sponsor->id;
        $db = Database::getDB();
        $tbl = $db->addTable('access_shortcuts');
        $tbl->addFieldConditional('url', $url);
        $tbl->addField('id');
        $shortcutId = $db->selectColumn();
        $db->clearConditional();
        if (empty($shortcutId)) {
            $tbl->usePearSequence(true);
            $tbl->addValue('keyword', $sponsor->searchName);
            $tbl->addValue('url', 'volunteer:' . $sponsor->id);
            $tbl->addValue('active', 1);
            return $db->insert();
        } else {
            $tbl->addValue('keyword', $sponsor->searchName);
            $tbl->addFieldConditional('id', $shortcutId);
            return $db->update();
        }
    }

}
