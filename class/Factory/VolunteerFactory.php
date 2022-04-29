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

    public static function getByHash(string $hash)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_volunteer');
        $tbl->addFieldConditional('hash', $hash);
        $volunteerArray = $db->selectOneRow();
        if (empty($volunteerArray)) {
            return false;
        } else {
            $volunteer = self::build();
            $volunteer->setVars($volunteerArray);
            return $volunteer;
        }
    }

    private static function hashExists(string $hash)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('vol_volunteer');
        $tbl->addField('id');
        $tbl->addFieldConditional('hash', $hash);
        return (bool) $db->selectOneRow();
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

    /**
     * Makes a short, random, hash of numbers and letters.
     * @return string
     */
    public static function makeHash()
    {
        $sets = array([48, 57], [65, 90], [97, 122]);
        for ($i = 0; $i < 8; $i++) {
            $select = $sets[rand(0, 2)];
            $char[] = chr(random_int($select[0], $select[1]));
        }
        return implode('', $char);
    }

    protected static function buildHash(Volunteer $volunteer)
    {
        $count = 0;
        if ($volunteer->isEmpty('hash')) {
            $hash = null;
            while (is_null($hash) || self::hashExists($hash)) {
                $hash = self::makeHash();
                $count++;
                /// Juuuuust in case
                if ($count > 50) {
                    throw new \Exception('Build hash overflow');
                }
            }

            $volunteer->hash = $hash;
            self::save($volunteer);
        }
        return $volunteer->hash;
    }

    /**
     * Pulls the volunteer from the local db and updates its
     * information from Banner/Data warehouse
     * @param int $volunteerId
     * @return Volunteer
     * @throws \Exception
     */
    public static function refresh(int $volunteerId)
    {
        $volunteer = self::build($volunteerId);
        $result = Banner::queryServer($volunteer->bannerId);
        if ($result) {
            $student = $result['student'];
            $volunteer->userName = $student->userName;
            $volunteer->email = $student->userName . VOL_SHIB_DOMAIN;
            $volunteer->firstName = $student->firstName;
            $volunteer->lastName = $student->lastName;
            $volunteer->preferredName = $student->preferredName ?? null;
            self::save($volunteer);
            return $volunteer;
        } else {
            throw new \Exception('Volunteer not found in Banner');
        }
    }

    public static function sendEmails(int $volunteerId, array $sponsors)
    {
        if (empty($sponsors)) {
            throw new \Exception('');
        }
        $volunteer = self::build($volunteerId);
        self::buildHash($volunteer);

        $emailList[] = $volunteer->email;
        foreach ($sponsors as $sponsorId) {
            $sponsor = SponsorFactory::build($sponsorId);
            $siteUrl = \Canopy\Server::getSiteUrl() . $sponsor->searchName . '?hash=' . $volunteer->hash;
            $subject = 'Faster log in and out for ' . $sponsor->name;
            $body = <<<EOF
<p>We are emailing to supply you with a faster method to log in and out of
{$sponsor->name}. When you arrive, skip the log in process by clicking the link below.</p>
<p><a href="$siteUrl">Log in or out of {$sponsor->name}</a></p>
<p>Please do not share this link.</p>

EOF;
            EmailFactory::send($subject, $body, $emailList, true);
        }
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
        parent::applyOptions($db, $tbl, $options, ['firstName', 'lastName', 'preferredName', 'bannerId']);
        return $db->select();
    }

}
