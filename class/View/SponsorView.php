<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\View;

use volunteer\Factory\SponsorFactory;
use phpws2\Template;

require_once PHPWS_SOURCE_DIR . 'mod/volunteer/vendor/autoload.php';

use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;

class SponsorView extends AbstractView
{

    public static function qrCode($sponsorId)
    {
        $sponsor = SponsorFactory::build($sponsorId);
        $url = SponsorFactory::getUrl($sponsor);
        $options = new QROptions(['scale' => 10]);
        $qrcode = new QRCode($options);

        $vars['image'] = '<img style="width: 800px;height: 800px" src="' . $qrcode->render($url) . '"/>';
        $vars['sponsorName'] = $sponsor->name;
        $template = new Template($vars);
        $template->setModuleTemplate('volunteer', 'QRCode.html');
        return $template->get();
    }

}
