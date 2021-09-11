<?php
/*
TODO:
    -have a function that returns contacts based on a user key rather than every contact in the database
    -make add function
    -make edit function
    -make delete function
    -Search 
*/

class Contact   {
    //database table
    private $conn;
    private $table = 'Contacts';

    //contact table fields
    public $contactID;
    public $firstName;
    public $lastName;
    public $phoneNumber;
    public $emailAddress;
    public $userID;

    //constructor with db connection;
    public function __construct($db)    {
        $this->conn = $db;
    }

    //get contacts from db
    public function read(){
        //create query
        $query = "SELECT
            ID,
            FirstName,
            LastName,
            PhoneNumber,
            EmailAddress,
            UserID
        FROM
            $this->table
        ORDER BY
            LastName
        ASC";

        $statement = $this->conn->prepare($query);
        if(!$statement->execute())
        {
            echo json_encode(array('error' => "statement execution failed"));
        }

        return $statement;
    }

    //need to get all info realated to a specific user key
    public function searchByUserAndLetter($search){
        //create query
        $this->userKey = htmlspecialchars($this->userKey);
        $search = htmlspecialchars($search);

        $search = '\'' . $search . '%\'';

        $query = "SELECT
            ID,
            FirstName,
            LastName,
            PhoneNumber,
            EmailAddress
        FROM
            $this->table
        WHERE
            (UserID = $this->userKey AND LastName LIKE $search)
        ORDER BY
            LastName
        ASC";

        //$this->userKey = htmlspecialchars($this->userKey);
        //$search = htmlspecialchars($search);

        $statement = $this->conn->prepare($query);
        //$search = '\'' . $search . '%\'';
        //$statement->bindParam(':letter', $search);
        //$statement->bindParam(':userID', $this->userKey);
        if(!$statement->execute())  {
            echo $statement->error;
        }

        return $statement;
    }
}



?>