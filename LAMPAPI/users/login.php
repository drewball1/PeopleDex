<?php
//headers
header('Content-type: application/json');

//initialize api and database connection
require_once('../core/User.php');
require_once('../config/Database.php');

$database = new Database();
$db = $database->connect();

$user = new user($db);

//Get user data
$userInput = json_decode(file_get_contents('php://input'));

$user->login = $userInput->login;
$user->password = $userInput->password;

$result = $user->login();

//make json data
$resultArray = array();
$resultArray['meta'] = array('Error'  => '');

if($result) {
    if($rowInfo = $result->fetch(PDO::FETCH_ASSOC))  {
        extract($rowInfo);

        $userInfo = array(
            'ID' => $ID,
            'FirstName' => $FirstName,
            'LastName' => $LastName,
            'DateCreated' => $DateCreated,
            'DateLastLoggedIn' => $DateLastLoggedIn);
        
        $resultArray['info'] = array();
        array_push($resultArray['info'], $userInfo);

        $user->updateDate();
    }
    else    {
        $resultArray['meta']['Error'] = 'User not found';
    }
}
else    {
    $resultArray['meta']['Error'] = 'User not found';
}

//return user info
echo json_encode($resultArray);
?>