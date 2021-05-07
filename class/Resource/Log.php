<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace volunteer\Resource;

class Log extends AbstractResource
{

    protected $action;
    protected $newTimeIn;
    protected $newTimeOut;
    protected $oldTimeIn;
    protected $oldTimeOut;
    protected $punchId;
    protected $sponsorId;
    protected $volunteerId;
    protected $timestamp;
    protected $userId;
    protected $table = 'vol_log';

    public function __construct()
    {
        parent::__construct();
        $this->action = new \phpws2\Variable\TextOnly(null, 'action');
        $this->newTimeIn = new \phpws2\Variable\IntegerVar(0, 'newTimeIn');
        $this->newTimeOut = new \phpws2\Variable\IntegerVar(0, 'newTimeOut');
        $this->oldTimeIn = new \phpws2\Variable\IntegerVar(0, 'oldTimeIn');
        $this->oldTimeOut = new \phpws2\Variable\IntegerVar(0, 'oldTimeOut');
        $this->punchId = new \phpws2\Variable\IntegerVar(0, 'punchId');
        $this->sponsorId = new \phpws2\Variable\IntegerVar(0, 'sponsorId');
        $this->volunteerId = new \phpws2\Variable\IntegerVar(0, 'volunteerId');
        $this->timestamp = new \phpws2\Variable\DateTime(0, 'timestamp');
        $this->userId = new \phpws2\Variable\IntegerVar(0, 'userId');
    }

    public function stamp()
    {
        $this->timestamp->stamp();
    }

    public function setAction($action)
    {
        switch ($action) {
            case 'timeChange':
            case 'approved':
                $this->action->set($action);
                break;
            default:
                throw new \Exception('Unknown action type');
        }
    }

}
