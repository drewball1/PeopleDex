<?php
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

    //returns contacts that last name start with a letter and are associated with 1 userid
    public function searchByUserAndLetter($search){
        //create query
        $query = "SELECT
            ID,
            FirstName,
            LastName,
            PhoneNumber,
            EmailAddress
        FROM
            $this->table
        WHERE
            (UserID = :userID AND LastName LIKE :search)
        ORDER BY
            LastName
        ASC";

        //sanitize
        $this->userID = htmlspecialchars($this->userID);
        $search = htmlspecialchars($search);

        $statement = $this->conn->prepare($query);

        //adds wildcard
        $search = $search . '%';
        
        //bind
        $statement->bindParam(':search', $search);
        $statement->bindParam(':userID', $this->userID);

        if(!$statement->execute())  {
            echo $statement->error;
        }

        return $statement;
    }

    //adds a contact to the contacts table
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
    
    //searches database for firstname or lastname containing a string
    public function search($search)    {
        $query = "SELECT
            ID,
            FirstName,
            LastName,
            PhoneNumber,
            EmailAddress
        FROM
            $this->table
        WHERE
            (UserID = :userID AND FirstName LIKE :search) OR (UserID = :userID AND LastName LIKE :search)
        ORDER BY
            FirstName
        ASC";

        //sanitize
        $this->userID = htmlspecialchars($this->userID);
        $search = htmlspecialchars($search);

        //adds wildcards
        $search = '%' . $search . '%';
        $statement = $this->conn->prepare($query);

        //bind
        $statement->bindParam(':userID', $this->userID);
        $statement->bindParam(':search', $search);

        if(!$statement->execute())   {
            echo $statement->error;
        }

        return $statement;
    }
}
?>
