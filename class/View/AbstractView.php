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

namespace volunteer\View;

use Canopy\Request;
use phpws2\Template;

abstract class AbstractView
{

    const directory = PHPWS_SOURCE_DIR . 'mod/volunteer/';
    const http = PHPWS_SOURCE_HTTP . 'mod/volunteer/';

    protected static function getDirectory()
    {
        return self::directory;
    }

    protected static function getHttp()
    {
        return self::http;
    }

    private static function addScriptVars($vars)
    {
        if (empty($vars)) {
            return null;
        }
        foreach ($vars as $key => $value) {
            $varList[] = "const $key = " . json_encode($value, JSON_NUMERIC_CHECK) . ';';
        }
        return '<script type="text/javascript">' . implode('', $varList) . '</script>';
    }

    protected static function getScript($scriptName)
    {
        $jsDirectory = self::getHttp() . 'javascript/';
        if (VOLUNTEER_SYSTEM_SETTINGS['productionMode']) {
            $path = $jsDirectory . 'build/' . self::getAssetPath($scriptName);
        } else {
            $path = "{$jsDirectory}dev/$scriptName.js";
        }
        $script = "<script type='text/javascript' src='$path'></script>";
        return $script;
    }

    protected static function getAssetPath($scriptName)
    {
        if (!is_file(self::getDirectory() . 'assets.json')) {
            exit('Missing assets.json file. Run "npm run build" in the volunteer directory.');
        }
        $jsonRaw = file_get_contents(self::getDirectory() . 'assets.json');
        $json = json_decode($jsonRaw, true);
        if (!isset($json[$scriptName]['js'])) {
            throw new \Exception('Script file not found among assets.');
        }
        return $json[$scriptName]['js'];
    }

    /**
     *
     * @staticvar boolean $vendor_included
     * @param string $view_name
     * @param boolean $add_anchor
     * @param array $vars
     * @return string
     */
    public static function scriptView($view_name, $vars = null)
    {
        static $vendor_included = false;
        if (!$vendor_included) {
            $script[] = self::getScript('vendor');
            $vendor_included = true;
        }
        if (!empty($vars)) {
            $script[] = self::addScriptVars($vars);
        }
        $script[] = self::getScript($view_name);
        $react = implode("\n", $script);
        \Layout::addJSHeader($react);
        $content = <<<EOF
<div id="$view_name"></div>
EOF;
        return $content;
    }

}
