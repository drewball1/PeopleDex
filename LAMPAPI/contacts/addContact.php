<?php
//header
header('Content-type: application/json');

//initialized DB connection
require_once('../core/Contact.php');
require_once('../config/Database.php');

$database = new Database();
$db = $database->connect();

$contact = new contact($db);

//read user input
$userInput = json_decode(file_get_contents('php://input'));

$contact->firstName = $userInput->firstName;
$contact->lastName = $userInput->lastName;
$contact->phoneNumber = $userInput->phoneNumber;
$contact->emailAddress = $userInput->emailAddress;
$contact->userID = $userInput->userID;

//add the contact
$result = $contact->addContact();

//retunr result
if($result)   {
    echo json_encode(array('result' => 'Success', 'Error' => 0, 'booleanResult' => true));
}
else    {
    echo json_encode(array('result' => 'Contact not added', 'Error' => 1, 'booleanResult' => false));
}

?>