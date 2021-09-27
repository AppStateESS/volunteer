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

class CSV
{

    public static function buildRows(array $list, string $type)
    {
        $reasons = ReasonFactory::listing(['sortById' => true]);
        $csv = [];
        foreach ($list as $listRow) {
            $reason = 'N/A';
            if ($listRow['reasonId'] > 0 && isset($reasons[$listRow['reasonId']])) {
                $reason = $reasons[$listRow['reasonId']]['title'];
            }
            if ($type === 'sponsor') {
                $csvrow['firstName'] = $listRow['firstName'];
                $csvrow['preferredName'] = $listRow['preferredName'] ?? '';
                $csvrow['lastName'] = $listRow['lastName'];
                $csvrow['bannerId'] = $listRow['bannerId'];
            } else {
                $csvrow['sponsor'] = $listRow['sponsorName'];
            }
            $csvrow['reason'] = $reason;
            $csvrow['timeIn'] = strftime('%Y%m%d %H:%M:%S', $listRow['timeIn']);
            $csvrow['timeOut'] = strftime('%Y%m%d %H:%M:%S', $listRow['timeOut']);
            $csvrow['totalTime'] = $listRow['attended'] === '1' ? 'Attended' : $listRow['totalTime'];
            $csvrow['totalMinutes'] = $listRow['attended'] === '1' ? 0 : (int) $listRow['totalMinutes'];
            $csv[] = $csvrow;
        }
        array_unshift($csv, array_keys($csvrow));
        return $csv;
    }

    public static function buildSponsorReport(array $csv, $downloadName)
    {
        $filename = '/tmp/volreport' . microtime() . '.csv';
        $fp = fopen($filename, 'w');
        foreach ($csv as $row) {
            fputcsv($fp, $row, ",", '"', "\\");
        }

        fclose($fp);

        header("Content-Disposition: attachment; filename=\"$downloadName\"");
        header('Pragma: public');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        readfile($filename);
        exit();
    }

}
