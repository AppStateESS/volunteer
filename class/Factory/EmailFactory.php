<?php

/**
 * MIT License
 * Copyright (c) 2022 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Factory;

if (!defined('VOLUNTEER_SENDMAIL_COMMAND')) {
    define('VOLUNTEER_SENDMAIL_COMMAND', '/usr/sbin/sendmail -t -i');
}

if (!defined('VOLUNTEER_SWIFT_OLD_VERSION')) {
    define('VOLUNTEER_SWIFT_OLD_VERSION', false);
}

class EmailFactory
{

    public static function send(string $subject, string $body, array $emailList, $htmlFormat = false)
    {

        if (VOLUNTEER_SWIFT_OLD_VERSION) {
            $transport = \Swift_SendmailTransport::newInstance(VOLUNTEER_SENDMAIL_COMMAND);
            $message = \Swift_Message::newInstance();
        } else {
            $transport = new \Swift_SendmailTransport(VOLUNTEER_SENDMAIL_COMMAND);
            $message = new \Swift_Message;
        }

        $from = SettingsFactory::getSwiftMailReply();
        if (empty($from)) {
            throw new \Exception('Site contact email is not set.');
        }
        $message->setSubject($subject);

        $message->setFrom($from);
        if ($htmlFormat) {
            $message->setBody($body, 'text/html');
        } else {
            $message->setBody($body);
        }
        $mailer = new \Swift_Mailer($transport);
        foreach ($emailList as $to) {
            if (is_array($to)) {
                $message->setTo($to['email']);
            } else {
                $message->setTo($to);
            }
            $mailer->send($message);
        }
    }

}
