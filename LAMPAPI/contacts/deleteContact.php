<?php
header('Content-type: application/json');

require_once('../core/Contact.php');
require_once('../config/Database.php');

$database = new Database();
$db = $database->connect();

$contact = new contact($db);

$userInput = json_decode(file_get_contents('php://input'));

$contact->contactID = $userInput->ID;

$result = $contact->deleteContact();

if($result)   {
    echo json_encode(array('result' => 'Success', 'Error' => 0, 'booleanResult' => true));
}
else    {
    echo json_encode(array('result' => 'Contact not deleted', 'Error' => 1, 'booleanResult' => false));
}
?>