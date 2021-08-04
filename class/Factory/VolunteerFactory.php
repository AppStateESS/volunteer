<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Factory;

use phpws2\Database;
use volunteer\Resource\Volunteer;

class VolunteerFactory extends AbstractFactory
{

    /**
     *
     * @param int $id
     * @return \volunteer\Resource\Volunteer
     */
    public static function build(int $id = 0)
    {
        $volunteer = new Volunteer;
        return $id > 0 ? self::load($volunteer, $id) : $volunteer;
    }

    public static function delete(int $id)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_volunteer');
        $tbl->addFieldConditional('id', $id);
        return $db->delete();
    }

    /**
     *
     * @param type $createIfNotFound
     * @return
     */
    public static function loadCurrent(bool $createIfNotFound = true)
    {
        $volunteer = self::loadByUsername(Authenticate::getLoginUsername());
        if ($volunteer) {
            return $volunteer;
        } elseif ($createIfNotFound) {
            return self::createStudent(Authenticate::getLoginUsername());
        } else {
            Authenticate::sendToLogin();
        }
    }

    public static function loadByBannerId(string $bannerId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_volunteer');
        $tbl->addFieldConditional('bannerId', $bannerId);
        $row = $db->selectOneRow();
        if (empty($row)) {
            return false;
        } else {
            $volunteer = new Volunteer;
            $volunteer->setVars($row);
            return $volunteer;
        }
    }

    public static function loadByUsername(string $username)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_volunteer');
        $tbl->addFieldConditional('userName', $username);
        $row = $db->selectOneRow();
        if (empty($row)) {
            return false;
        } else {
            $volunteer = new Volunteer;
            $volunteer->setVars($row);
            return $volunteer;
        }
    }

    /**
     * Tries to pull a student from Banner using the email address.
     * If it exists, then a volunteer account is made and returned.
     * This function assumes vol_volunteer was checked prior.
     * @param string $email
     * @return Volunteer
     */
    public static function pullFromBannerByEmail(string $email)
    {
        // If the email address doesn't match our expected domain
        // we don't bother continuing
        $searchString = '/' . VOL_SHIB_DOMAIN . '$/';
        if (!preg_match($searchString, $email)) {
            return null;
        }
        $username = preg_replace($searchString, '', $email);
        $result = Banner::queryServer($username);
        if ($result) {
            return self::buildVolunteerFromBannerResult($result);
        } else {
            return null;
        }
    }

    /**
     * Expects an Banner object result and creates a new Volunteer
     * from the data.
     * @param object $result
     * @return Volunteer
     */
    private static function buildVolunteerFromBannerResult(array $result)
    {
        $student = $result['student'];
        $volunteer = new Volunteer;
        $volunteer->userName = $student->userName;
        $volunteer->email = $student->userName . VOL_SHIB_DOMAIN;
        $volunteer->firstName = $student->firstName;
        $volunteer->lastName = $student->lastName;
        $volunteer->preferredName = $student->preferredName ?? null;
        $volunteer->bannerId = (string) $student->bannerID;
        self::saveResource($volunteer);
        return $volunteer;
    }

    public static function stampVisit(int $volunteerId)
    {
        $volunteer = self::build($volunteerId);
        if ($volunteer) {
            $volunteer->stampVisit();
            self::save($volunteer);
        }
    }

    /**
     * Pulls a single visitor from the database.
     * @param string $email
     * @return Volunteer
     */
    public static function getByEmail(string $email)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_volunteer');
        $tbl->addFieldConditional('email', $email);
        $row = $db->selectOneRow();
        if (empty($row)) {
            return;
        }
        $volunteer = self::build();
        $volunteer->setVars($row);
        return $volunteer;
    }

    /**
     * Creates a volunteer based on the received Banner ID.
     * @param string $identifier
     * @return Volunteer
     * @throws \volunteer\Exception\StudentNotFound
     */
    public static function createStudent(string $identifier)
    {
        $result = Banner::queryServer($identifier);

        if ($result['success']) {
            return self::buildVolunteerFromBannerResult($result);
        } else {
            throw new \volunteer\Exception\StudentNotFound($identifier);
        }
    }

    /**
     * Creates a non-student (no Banner ID) volunteer.
     * @param string $email
     * @param string $firstName
     * @param string $lastName
     * @return Volunteer
     */
    public static function createVisitor(string $email, string $firstName, string $lastName)
    {
        $volunteer = new Volunteer;
        $volunteer->userName = $email;
        $volunteer->email = $email;
        $volunteer->firstName = $firstName;
        $volunteer->lastName = $lastName;
        $volunteer->preferredName = null;
        $volunteer->bannerId = '';
        self::saveResource($volunteer);
        return $volunteer;
    }

    public static function list($options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_volunteer');
        $tbl->addField('userName');
        $tbl->addField('bannerId');
        $tbl->addField('firstName');
        $tbl->addField('preferredName');
        $tbl->addField('lastName');
        $tbl->addField('id');
        $tbl->addField('email');
        $tbl->addField('totalVisits');
        $lastLog = $tbl->getField('lastLog');
        $exp = new Database\Expression('FROM_UNIXTIME(' . $lastLog . ', "%Y/%m/%d %e %l:%i %p")', 'lastLog');
        $tbl->addField($exp);
        parent::applyOptions($db, $tbl, $options, ['firstName', 'lastName', 'preferredName']);
        return $db->select();
    }

}
