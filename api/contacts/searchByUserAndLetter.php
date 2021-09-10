<?php

//initialize api and database connection
require_once('../core/Contact.php');
require_once('../config/Database.php');

$database = new Database();
$db = $database->connect();

$contact = new contact($db);

$userInput = json_decode(file_get_contents('php://input'));

$contact->userKey = $userInput->userKey;
$search = $userInput->search;

$result = $contact->searchByUserAndLetter($search);

$numofResults = $result->rowCount();

$resultArray = array();
$resultArray['meta'] = array('NumberOfResults' => $numofResults, 'Error' => '');

if($numofResults > 0)   {
    $resultArray['info'] = array();

    while($rowInfo = $result->fetch(PDO::FETCH_ASSOC)){
        extract($rowInfo);
        
        $contactInfo = array('ID' => $ID, 'FirstName' => $FirstName, 'LastName' => $LastName,
            'PhoneNumber' => $PhoneNumber, 'EmailAddress' => $EmailAddress);
        
        array_push($resultArray['info'], $contactInfo);
    }
}
else    {
    $resultArray['meta']['Error'] = 'No records found';
}

echo json_encode($resultArray);
?>