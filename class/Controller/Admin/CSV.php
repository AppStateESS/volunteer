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

namespace volunteer\Controller\Admin;

use volunteer\Controller\SubController;
use Canopy\Request;
use volunteer\Factory\SponsorFactory;
use volunteer\Factory\VolunteerFactory;

class CSV extends SubController
{

    protected function listHtml(Request $request)
    {
        $report = $request->pullGetString('report');
        $volunteerId = $request->pullGetInteger('volunteerId', true);
        $from = (int) $request->pullGetInteger('from', true);
        $to = (int) $request->pullGetInteger('to', true);

        $options = [
            'approvedOnly' => true,
            'to' => $to,
            'from' => $from];
        if ($report === 'sponsor') {
            $sponsorId = $request->pullGetInteger('sponsorId');
            $sponsor = SponsorFactory::build($sponsorId);
            $options['sponsorId'] = $sponsorId;
            $options['includeVolunteer'] = true;
            $fileName = $sponsor->name . ' - ' .
                    strftime('%m%d%Y', $from) . ' to ' .
                    strftime('%m%d%Y', $to) . '.csv';
        } elseif ($report === 'volunteer') {
            $volunteerId = $request->pullGetInteger('volunteerId');
            $volunteer = VolunteerFactory::build($volunteerId);
            $options['volunteerId'] = $volunteerId;
            $options['includeSponsor'] = true;
            $fileName = $volunteer->getFullName() . ' - ' .
                    strftime('%m%d%Y', $from) . ' to ' .
                    strftime('%m%d%Y', $to) . '.csv';
        } else {
            throw new \Exception('Unknown CSV report type');
        }
        $list = \volunteer\Factory\PunchFactory::list($options);
        if (empty($list)) {
            exit('No rows found');
        }
        $csvRows = \volunteer\Factory\CSV::buildRows($list, $report);
        \volunteer\Factory\CSV::buildSponsorReport($csvRows, $fileName);
        exit;
    }

}
