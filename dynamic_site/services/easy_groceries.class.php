<?php

date_default_timezone_set('America/Toronto');

class EasyGroceries{

    public $dbo ="";

    public function __constructor(){
        require_once("./inc/connect_pdo.php");
        $this->dbo = $dbo;
    }

    public function getDepartments(){
        $errorCode = 0;
        $errorMessage = '';

        try {
            $query = "SELECT id, name FROM ea_category ORDER BY name";

            foreach($this->dbo->query($query) as $row) {

            }
        }


        $error["id"] = $errorCode;
        $error["message"] = $errorMessage;

        $data["error"] = $error;

    }
}


?>