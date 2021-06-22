<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Controller\Admin;

use volunteer\Controller\SubController;
use volunteer\Factory\PunchFactory;
use volunteer\Factory\LogFactory;
use volunteer\View\PunchView;
use volunteer\View\AdminView;
use Canopy\Request;

class Punch extends SubController
{

    protected function listJson(Request $request)
    {
        $sponsorId = $request->pullGetInteger('sponsorId');
        $volunteerId = $request->pullGetInteger('volunteerId');
        if ($sponsorId) {
            $listing = PunchFactory::list(['sponsorId' => $request->pullGetInteger('sponsorId'),
                        'includeVolunteer' => true,
                        'to' => $request->pullGetInteger('to', true),
                        'from' => $request->pullGetInteger('from', true)]);
            if (!empty($listing)) {
                return PunchFactory::sortPunches($listing, true)[0];
            } else {
                return [];
            }
        } elseif ($volunteerId) {
            return PunchFactory::list(['volunteerId' => $request->pullGetInteger('volunteerId'),
                        'sortBySponsor' => true,
                        'includeTotals' => true,
                        'to' => $request->pullGetInteger('to', true),
                        'from' => $request->pullGetInteger('from', true)]);
        } else {
            throw new \Exception('Missing id');
        }
    }

    protected function reportJson(Request $request)
    {
        return PunchFactory::list(['volunteerId' => $request->pullGetInteger('volunteerId'),
                    'sortBySponsor' => true,
                    'includeTotals' => true,
                    'to' => $request->pullGetInteger('to', true),
                    'from' => $request->pullGetInteger('from', true)]);
    }

    protected function punchOutPut(Request $request)
    {
        $punch = PunchFactory::build($this->id);
        PunchFactory::out($punch);
        return ['success' => true];
    }

    protected function approvePatch(Request $request)
    {
        $punch = PunchFactory::build($this->id);
        PunchFactory::approve($punch);
        LogFactory::approved($punch->id, $punch->sponsorId);
        return ['success' => true];
    }

    protected function approvalListPost(Request $request)
    {
        $approvals = $request->pullPostArray('approvals');
        if (!empty($approvals)) {
            $result = PunchFactory::massApprove($approvals);
            if ($result) {
                foreach ($approvals as $punchId) {
                    LogFactory::approved($punchId);
                }
            }
        }
        return ['success' => true];
    }

    protected function unapprovedHtml()
    {
        AdminView::showMenu('unapproved');
        return PunchView::unapproved();
    }

    protected function unapprovedJson()
    {
        $options['unapprovedOnly'] = true;
        $options['includeVolunteer'] = true;
        $options['includeSponsor'] = true;

        return PunchFactory::list($options);
    }

    protected function put(Request $request)
    {
        $punch = PunchFactory::build($this->id);
        $oldTimeIn = $punch->timeIn;
        $oldTimeOut = $punch->timeOut;
        $punch->timeIn = $request->pullPutInteger('timeIn');
        $punch->timeOut = $request->pullPutInteger('timeOut');
        PunchFactory::save($punch);
        LogFactory::timeChange($oldTimeIn, $oldTimeOut, $punch);
        return ['success' => true];
    }

    protected function delete(Request $request)
    {
        $punch = PunchFactory::build($this->id);
        PunchFactory::deleteResource($punch);
        return ['success' => true];
    }

}
