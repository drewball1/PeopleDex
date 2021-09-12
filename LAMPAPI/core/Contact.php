<?php
/*
TODO:
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

    public function addContact()    {
        //create query
        $query = "INSERT INTO
            $this->table
        (FirstName, LastName, EmailAddress, PhoneNumber, UserID)
        VALUES
        (:firstName, :lastName, :emailAddress, :phoneNumber, :userID)";

        $statement = $this->conn->prepare($query);

        //sanitize
        $this->firstName = htmlspecialchars($this->firstName);
        $this->lastName = htmlspecialchars($this->lastName);
        $this->emailAddress = htmlspecialchars($this->emailAddress);
        $this->phoneNumber = htmlspecialchars($this->phoneNumber);
        $this->userID = htmlspecialchars($this->userID);

        //bind
        $statement->bindParam(':firstName', $this->firstName);
        $statement->bindParam(':lastName', $this->lastName);
        $statement->bindParam(':emailAddress', $this->emailAddress);
        $statement->bindParam(':phoneNumber', $this->phoneNumber);
        $statement->bindParam(':userID', $this->userID);

        if($statement->execute())   {
            return true;
        }
        else    {
            //if it failed we see the error
            echo("Add Contact Execution Error: $statement->error");
            return false;
        }
    }

    //deletes a contact
    public function deleteContact() {
        $query = "DELETE FROM $this->table WHERE ID = :contactID";

        $statement = $this->conn->prepare($query);

        //sanitize
        $this->contactID = htmlspecialchars($this->contactID);

        //bind
        $statement->bindParam(':contactID', $this->contactID);

        if($statement->execute())   {
            return true;
        }
        else    {
            //if it failed we see the error
            echo("Delete Contact Execution Error: $statement->error");
            return false;
        }
    }

    //edit a contact
    //must provide all fields even if they dont change
    public function editContact()   {
        $query = "UPDATE $this->table
            SET FirstName = :firstName, LastName = :lastName, EmailAddress = :emailAddress, PhoneNumber = :phoneNumber
            WHERE ID = :contactID";

        $statement = $this->conn->prepare($query);

        //sanitize
        $this->contactID = htmlspecialchars($this->contactID);
        $this->firstName = htmlspecialchars($this->firstName);
        $this->lastName = htmlspecialchars($this->lastName);
        $this->emailAddress = htmlspecialchars($this->emailAddress);
        $this->phoneNumber = htmlspecialchars($this->phoneNumber);

        //bind
        $statement->bindParam(':contactID', $this->contactID);
        $statement->bindParam(':firstName', $this->firstName);
        $statement->bindParam(':lastName', $this->lastName);
        $statement->bindParam(':emailAddress', $this->emailAddress);
        $statement->bindParam(':phoneNumber', $this->phoneNumber);

        if($statement->execute())   {
            return true;
        }
        else    {
            //if it failed we see the error
            echo("Delete Contact Execution Error: $statement->error");
            return false;
        }
    }
}
?>