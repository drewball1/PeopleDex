<?php

//initialize api and database connection
require_once('../core/Contact.php');
require_once('../config/Database.php');

$database = new Database();
$db = $database->connect();

$contact = new contact($db);

//call the sql function in the model
$result = $contact->read();

$numofResults = $result->rowCount();

//makes an array that will be the base for the JSON
$resultArray = array();
//adds metadata to the JSON
$resultArray['meta'] = array('NumberOfResults' => $numofResults, 'Error' => '');

//check if we returned any results
if($numofResults > 0)   {
    //makes info sub array
    $resultArray['info'] = array();

    //inserts all from the query inserts it into the array based on the names
    while($rowInfo = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($rowInfo);

        $contactInfo = array('ContactID' => $ContactID, 'FirstName' => $FirstName,
            'LastName' => $LastName, 'PhoneNumber' => $PhoneNumber,
            'EmailAddress' => $EmailAddress, 'UserKey' => $UserKey);

        array_push($resultArray['info'], $contactInfo);
    }
}
//no results write an error to the JSON
else    {
    $resultArray['meta']['Error'] = 'No records found';
}

//at the end we return the array as a JSON
echo json_encode($resultArray);

?>