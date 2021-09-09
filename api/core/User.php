<?php
/*
TODO:
    -trim the login function to return only the needed information
    -make an endpoint for the login new function
    -make add function
    -make edit function
    -make delete function

*/

class User  {
    //set database
    private $conn;
    private $table = 'users';
    
    //user fields
    public $id;
    public $dateCreated;
    public $dateLastLoggedIn;
    public $firstName;
    public $lastName;
    public $login;      //whatever string the user chooses
    public $password;   //this will be a hash on our end

    public function __construct($db)    {
        $this->conn = $db;
    }

    //function that reads all data, will probably be used for testing but disabled later
    public function read()  {

    }

    //get specific user based on login and password
    public function searchUserLogin($userLogin, $userPass)   {
        $query = "SELECT
            ID,
            DateCreated,
            DateLastLoggedIn,
            FirstName,
            LastName,
            Login,
            Password
        FROM
            $this->table
        WHERE
            Login = $userLogin AND Password = $userPass";

        $statement = $this->conn->prepare($query);
        $statement->execute();

        return $statement;
    }
}




?>