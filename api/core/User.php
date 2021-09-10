<?php
/*
TODO:
    -trim the login function to return only the needed information
    -make an endpoint for the login new function
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
    public function searchUserLogin()   {
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
            Login = :login AND Password = :password";

        //Sanitizes for html insertion
        $this->login = htmlspecialchars($this->login);
        $this->password = htmlspecialchars($this->password);

        $statement = $this->conn->prepare($query);
        $statement->bindParam(':login', $this->login);
        $statement->bindParam(':password', $this->password);

        return $statement;
    }

    public function registerUser()  {
        $request = "IF NOT EXISTS (SELECT Login AND Password FROM $this->table
            WHERE Login = :login
            AND Password = :password)
        BEGIN
            INSERT INTO $this->table (FirstName, LastName, Login, Password)
            VALUES (:firstName, :lastName, :login, :password)";

        $statement = $this->conn->prepare($request);

        //sanitize
        $this->login = htmlspecialchars($this->login);
        $this->password = htmlspecialchars($this->password);
        $this->firstName = htmlspecialchars($this->firstName);
        $this->lastName = htmlspecialchars($this->lastName);
        $this->login = htmlspecialchars($this->login);
        $this->password = htmlspecialchars($this->password);

        //bind
        $statement->bindParam(':login', $this->login);
        $statement->bindParam(':password', $this->password);
        $statement->bindParam(':firstName', $this->firstName);
        $statement->bindParam(':lastName', $this->lastName);
        $statement->bindParam(':login', $this->login);
        $statement->bindParam(':password', $this->password);

        if($statement->execute())   {
            return true;
        }
        else    {
            //if it failed we see the error
            echo("Register User Execution Error: $statement->error");
            return false;
        }
    }
}




?>