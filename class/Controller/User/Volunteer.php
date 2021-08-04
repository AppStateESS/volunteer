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

namespace volunteer\Controller\User;

use volunteer\Controller\SubController;
use volunteer\Factory\VolunteerFactory;
use volunteer\Factory\PunchFactory;
use volunteer\Factory\ReasonFactory;
use Canopy\Request;

class Volunteer extends SubController
{

    /**
     * Pulls a volunteer account by email.
     * @param Request $request
     * @return array
     */
    protected function searchByEmailJson(Request $request)
    {
        $email = strtolower(trim($request->pullGetString('email')));
        $volunteer = VolunteerFactory::getByEmail($email);
        $sponsorId = $request->pullGetInteger('sponsorId');
        $includeReasons = $request->pullGetBoolean('includeReasons');
        if ($volunteer) {
            return PunchFactory::punchReply($volunteer, $sponsorId, $includeReasons);
        } else {
            $volunteer = VolunteerFactory::pullFromBannerByEmail($email);
            if ($volunteer) {
                return PunchFactory::punchReply($volunteer, $sponsorId, $includeReasons);
            } else {
                return ['success' => false];
            }
        }
    }

    protected function visitorPost(Request $request)
    {
        $firstName = $request->pullPostString('firstName');
        $lastName = $request->pullPostString('lastName');
        $email = $request->pullPostString('email');
        $sponsorId = $request->pullPostInteger('sponsorId');
        $includeReasons = $request->pullPostBoolean('includeReasons');
        $volunteer = VolunteerFactory::createVisitor($email, $firstName, $lastName);
        return PunchFactory::punchReply($volunteer, $sponsorId, $includeReasons);
    }

//    private function visitorResponse(bool $includeReasons, int $sponsorId, \volunteer\Resource\Volunteer $volunteer)
//    {
//        if ($includeReasons) {
//            $reasons = ReasonFactory::listing(['sponsorId' => $sponsorId]);
//            if (empty($reasons)) {
//                PunchFactory::in($volunteer, $sponsorId);
//                return ['success' => true, 'result' => 'in', 'reasons' => []];
//            } else {
//                return ['success' => true, 'result' => 'reason', 'reasons' => $reasons, 'volunteerId' => $volunteer->id];
//            }
//        } else {
//            return ['success' => true, 'result' => 'reason', 'volunteerId' => $volunteer->id];
//        }
//    }
}
