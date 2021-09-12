<?php

header('Content-type: application/json');

//initialize api and database connection
require_once('../core/User.php');
require_once('../config/Database.php');

$database = new Database();
$db = $database->connect();

$user = new user($db);

//Get user data
$userInput = json_decode(file_get_contents('php://input'));

$user->firstName = $userInput->firstName;
$user->lastName = $userInput->lastName;
$user->login = $userInput->login;
$user->password = $userInput->password;

if($result = $user->registerUser())   {
    echo json_encode(array('result' => 'Success', 'Error' => 0, 'booleanResult' => true));
}
else    {
    if($result == 0){
        echo json_encode(array('result' => 'User Not Registerd', 'Error' => 1, 'booleanResult' => false));
    }
    else    {
        echo json_encode(array('result' => 'Login name already taken', 'Error' => 2,  'booleanResult' => false));
    }
}

?>