<?php
class User  {
    //set database
    private $conn;
    private $table = 'Users';
    
    //user fields
    public $id;
    public $dateCreated;
    public $dateLastLoggedIn;
    public $firstName;
    public $lastName;
    public $login;      //whatever string the user chooses
    public $password;   //this will be a hash on our end

    //overrides default constructor for one containing database
    public function __construct($db)    {
        $this->conn = $db;
    }

    //get specific user based on login and password
    public function login()   {
        $query = "SELECT
            ID,
            DateCreated,
            DateLastLoggedIn,
            FirstName,
            LastName
        FROM
            $this->table
        WHERE
            Login = :login AND Password = :password";

        //Sanitizes for html insertion
        $this->login = htmlspecialchars($this->login);
        $this->password = htmlspecialchars($this->password);

        $statement = $this->conn->prepare($query);

        //bind
        $statement->bindParam(':login', $this->login);
        $statement->bindParam(':password', $this->password);

        if($statement->execute())   {
            return $statement;
        }
        else    {
            echo "Login execution failed Error: $statement->error";
            return false;
        }
    }

    //updates date on login
    //used within the login function
    public function updateDate()    {
        $query = "UPDATE $this->table
        SET DateLastLoggedIn = CURRENT_TIMESTAMP
        WHERE Login = :login AND Password = :password";

        $statement = $this->conn->prepare($query);

        //bind
        $statement->bindParam(':login', $this->login);
        $statement->bindParam(':password', $this->password);

        $statement->execute();
    }

    //adds user
    public function registerUser()  {
        $request = "INSERT INTO $this->table (FirstName, LastName, Login, Password)
         VALUES (:firstName, :lastName, :login, :password)";

        $statement = $this->conn->prepare($request);

        //sanitize
        $this->firstName = htmlspecialchars($this->firstName);
        $this->lastName = htmlspecialchars($this->lastName);
        $this->login = htmlspecialchars($this->login);
        $this->password = htmlspecialchars($this->password);

        //bind
        $statement->bindParam(':firstName', $this->firstName);
        $statement->bindParam(':lastName', $this->lastName);
        $statement->bindParam(':login', $this->login);
        $statement->bindParam(':password', $this->password);

        try{
            if($statement->execute())   {
                return true;
            }
            else    {
                //if it failed we see the error
                echo("Register User Execution Error: $statement->error");
                return 0;
            }
        }
        catch(PDOException $e){
            echo $e; //stops it from saying that I dont use $e
            return false;
        }
    }
}




?>