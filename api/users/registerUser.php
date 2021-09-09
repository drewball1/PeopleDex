<?php

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

if($user->registerUser())   {
    echo json_encode(array('result' => 'Success', 'booleanResult' => true));
}
else    {
    echo json_encode(array('result' => 'User not registered', 'booleanResult' => false));
}

?>