<?php
//headers
header('Content-type: application/json');

//initialize DB connection
require_once('../core/Contact.php');
require_once('../config/Database.php');

$database = new Database();
$db = $database->connect();

$contact = new contact($db);

//user input
$userInput = json_decode(file_get_contents('php://input'));

$contact->firstName = $userInput->firstName;
$contact->lastName = $userInput->lastName;
$contact->phoneNumber = $userInput->phoneNumber;
$contact->emailAddress = $userInput->emailAddress;
$contact->contactID = $userInput->ID;

//edit the contact
$result = $contact->editContact();

//send result
if($result)   {
    echo json_encode(array('result' => 'Success', 'Error' => 0, 'booleanResult' => true));
}
else    {
    echo json_encode(array('result' => 'Contact not edited', 'Error' => 1, 'booleanResult' => false));
}
?>