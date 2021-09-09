<?php

    class Database  {
        //Database info if there are any changes change here
        private $host = "localhost";
        private $dbUser = "TheBeast";
        private $dbPassword = "professor0ak";
        private $dbName = "COP4331";
        private $conn;

        //call this to connect ot the database, use PDO myslqi is deprecated
        public function connect() {
            try {
                $this->conn = new PDO('mysql:host=' . $this->host . ';dbname='. $this->dbName, $this->dbUser, $this->dbPassword);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }
            catch (PDOException $e){
                echo "Error: ". $e->getMessage();
                exit;
            }

            return $this->conn;
        }
    }
?>