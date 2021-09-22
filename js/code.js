var urlBase = 'http://people-dex.xyz/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

var searchResults = [];
var selectedID = -1;

var lastSearch = "";
var lastType = "";

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5(password);

	document.getElementById("loginResult").innerHTML = "";

	//var tmp = {login:login,password:password};
	var tmp = { login: login, password: hash };
	var jsonPayload = JSON.stringify(tmp);

	var url = urlBase + '/users/login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject["info"]) {
					userId = jsonObject.info[0].ID;
				}

				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.info[0].FirstName;
				lastName = jsonObject.info[0].LastName;

				saveCookie();

				window.location.href = "dex.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie() {
	var minutes = 120;
	var date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function createContactField() {
	document.getElementById("createForm").style.display = 'inline-block';
	document.getElementById("searchBox").style.visibility = 'hidden';
	document.getElementById("createButton").style.visibility = 'hidden';
	document.getElementById("letterSearch").style.visibility = 'hidden';
	document.getElementById("header").innerHTML = "Enter Contact Information:";
}

function cancelCreate() {
	document.getElementById("createError").innerHTML = ' ';
	document.getElementById("success").innerHTML = '';
	document.getElementById("createForm").style.display = 'none';
	document.getElementById("contactFirstName").value = '';
	document.getElementById("contactLastName").value = '';
	document.getElementById("contactEmail").value = '';
	document.getElementById("phoneNumber").value = '';
	document.getElementById("searchBox").style.visibility = 'visible';
	document.getElementById("createButton").style.visibility = 'visible';
	document.getElementById("letterSearch").style.visibility = 'visible';
	document.getElementById("header").innerHTML = "What would you like to do?";
	document.getElementById("header").style.display = 'inline';
}

function beginCreateContact() {
	viewer.clearForm();
	viewer.setCreate();
}

/*function messageOn(){
    document.getElementById("success").style.display = 'inline-block';
    
    document.getElementById("labelFirstName").innerHTML = "";
    document.getElementById("labelLastName").innerHTML = "";
    document.getElementById("labelEmail").innerHTML = "";
    document.getElementById("labelPhone").innerHTML = "";
    
    document.getElementById("contactFirstName").style.display = 'none';
    document.getElementById("contactLastName").style.display = 'none';
    document.getElementById("contactEmail").style.display = 'none';
    document.getElementById("phoneNumber").style.display = 'none';
    
}*/

/*function messageOff(){
    document.getElementById("labelFirstName").innerHTML = "First Name:";
    document.getElementById("labelLastName").innerHTML = "Last Name:";
    document.getElementById("labelEmail").innerHTML = "Email:";
    document.getElementById("labelPhone").innerHTML = "Phone:";
    
    document.getElementById("contactFirstName").style.display = 'inline-block';
    document.getElementById("contactLastName").style.display = 'inline-block';
    document.getElementById("contactEmail").style.display = 'inline-block';
    document.getElementById("phoneNumber").style.display = 'inline-block';
    
    document.getElementById("success").style.display = 'none';
}*/

function createContact() {
	var fname = document.getElementById("contactFirstName").value;
	if (document.getElementById("contactFirstName").value.length == 0) {
		document.getElementById("createError").innerHTML = "Please Enter a First Name";
		return;
	}
	var lname = document.getElementById("contactLastName").value;
	var email = document.getElementById("contactEmail").value;
	var phone = document.getElementById("phoneNumber").value;

	readCookie();

	var tmp = { 
		ID: 0,
		userID: userId,
		firstName: fname,
		lastName: lname,
		phoneNumber: phone,
		emailAddress: email
	};

	var jsonPayload = JSON.stringify(tmp);

	var url = urlBase + '/contacts/addContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				// cancelCreate();
				// document.getElementById("searchBox").style.visibility = 'hidden';
				// document.getElementById("createButton").style.visibility = 'hidden';
				// document.getElementById("letterSearch").style.visibility = 'hidden';
				// document.getElementById("header").style.display = 'none';
        //messageOn();
				document.getElementById("success").innerHTML = 'Alright! ' + fname + ' ' + lname + ' was caught! New PeopleDex data will be added for ' + fname + ' ' + lname + '!';
				//setTimeout(messageOff, 2000);
        cancelCreate();
				setTimeout(viewer.setEmpty, 2000);
				if(document.getElementsByClassName("selected")[0] != undefined){
					reloadSearch();
				}
				populateWithSelected();
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("createError").innerHTML = err.message;
	}
}

function done() {
	if (viewer.state == viewer.editmode) {
		submitEdit();
	}
	else {
		createContact();
	}
}

function cancel() {
  if(document.getElementsByClassName("selected")[0] != undefined){
  	viewer.setViewing();
	  populateWithSelected();
  }
  else{
    viewer.setEmpty();
  }
}

// called after add or edit, following the refreshResults(). If the previously selected contact isn't in the list anymore
function populateWithSelected() {
	if(document.getElementsByClassName("selected")[0] != undefined){
		document.getElementById("contactFirstName").value = document.getElementById(selectedID).getAttribute("firstname");
		document.getElementById("contactLastName").value = document.getElementById(selectedID).getAttribute("lastname");
		document.getElementById("contactEmail").value = document.getElementById(selectedID).getAttribute("email");
		document.getElementById("phoneNumber").value = document.getElementById(selectedID).getAttribute("phone");
	}
}

function deleteContact() {
	var del = confirm("Once released, " + document.getElementById("contactFirstName").value + " " +  document.getElementById("contactLastName").value + " is gone forever. Ok?");

	if (del == false) {
		return;
	}
	else {
		//cancelCreate();
		//document.getElementById("searchBox").style.visibility = 'hidden';
		//document.getElementById("createButton").style.visibility = 'hidden';
		//document.getElementById("letterSearch").style.visibility = 'hidden';
		//document.getElementById("header").style.display = 'none';
		var tmp = { ID: document.getElementsByClassName("selected")[0].id };
		var jsonPayload = JSON.stringify(tmp);

		var url = urlBase + '/contacts/deleteContact.' + extension;

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try {
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					var jsonObject = JSON.parse(xhr.responseText);
					if (jsonObject.booleanResult == 1) {
						document.getElementById("success").innerHTML =  document.getElementById("contactFirstName").value + " " +  document.getElementById("contactLastName").value + " was released outside.";
						reloadSearch();
						setTimeout(cancelCreate, 3000);

					}

					else {
						document.getElementById("success").innerHTML = 'failure :('
						setTimeout(cancelCreate, 3000);
					}
				}
			};
			xhr.send(jsonPayload);
		}
		catch (err) {
			document.getElementById("searchResultBanner").innerHTML = err.message;
		}
	}
}

function select(id) {
	if (viewer.state == viewer.editmode || viewer.state == viewer.createmode) {
		return;
	}
	var original;

	var original = document.getElementsByClassName("selected")[0];
	if (original != undefined) {
		original.className = "unselected";
	}
	if(document.getElementById(id) != undefined){
		document.getElementById(id).className = "selected";

	selectedID = id;
	populateWithSelected();
	}
	else{
		selectedID = -1;
	}
	viewer.setViewing();
}

function searchContacts() {
	var srch = document.getElementById("searchText").value;
	lastSearch = srch;
	lastType = "search";
	document.getElementById("resultsList").innerHTML = "";
	document.getElementById("searchResultBanner").innerHTML = ""

	var contactList = "";

	readCookie();
	var tmp = { search: srch, userID: userId };
	var jsonPayload = JSON.stringify(tmp);

	var url = urlBase + '/contacts/search.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				
				var jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.meta.NumberOfResults == 0) {
					document.getElementById("searchResultBanner").innerHTML = "No Results Found";
				}

				else {
					document.getElementById("searchResultBanner").innerHTML = "Search Results:";

					for (var i = 0; i < jsonObject.info.length; i++) {
						var info = jsonObject.info[i];
						contactList += "<li class='unselected' id='";
						contactList += info.ID; //get id specifically
						contactList += "' onclick='select(this.id);'";
						contactList += " firstname='" + info.FirstName;
						contactList += "' lastname='" + info.LastName;
						contactList += "' email='" + info.EmailAddress;
						contactList += "' phone='" + info.PhoneNumber + "'>";
						contactList += info.FirstName + " " + info.LastName; //get first name and last name specifically
						contactList += "</li>";
					}

					document.getElementById("resultsList").innerHTML = contactList;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("searchResultBanner").innerHTML = err.message;
	}

}

function register() {
	var newFName = document.getElementById("firstName").value;
	if (newFName.length == 0) {
		document.getElementById("registerError").innerHTML = "Please enter your first name";
		document.getElementById("firstName").focus();
		return;
	}
	var newLName = document.getElementById("lastName").value;
	if (newLName.length == 0) {
		document.getElementById("registerError").innerHTML = "Please enter your last name";
		document.getElementById("lastName").focus();
		return;
	}
	var newUser = document.getElementById("login").value;
	if (newUser.length == 0) {
		document.getElementById("registerError").innerHTML = "Please enter a username";
		document.getElementById("login").focus();
		return;
	}
	var newPass = document.getElementById("password").value;
	if (newPass.length == 0) {
		document.getElementById("registerError").innerHTML = "Please enter a password";
		document.getElementById("login").focus();
		return;
	}
	if (newPass.length < 6) {
		document.getElementById("registerError").innerHTML = "Please enter a password 6 characters or longer.";
		document.getElementById("login").focus();
		return;
	}

	var hash = md5(newPass);
	var tmp = { firstName: newFName, lastName: newLName, login: newUser, password: hash };
	var jsonPayload = JSON.stringify(tmp);

	var url = urlBase + '/users/registerUser.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonObject = JSON.parse(xhr.responseText);
				if(jsonObject.Error === 0){
					document.getElementById("registrationBox").display = "none";
					document.getElementById("boxBanner").innerHTML = "Registration Successful!";
					setTimeout(goToIndex, 2000);
				}
				if(jsonObject.Error === 1){
					document.getElementById("registerError").innerHTML = "User not registered";
					setTimeout(goToIndex, 2000);
				}
				if(jsonObject.Error === 2){
					document.getElementById("registerError").innerHTML = "Username already taken";
					document.getElementById("login").reset() = "";
					document.getElementById("password").reset() = "";
					document.getElementById("login").focus();
					return;
				}

			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("registerError").innerHTML = err.message;
	}
}


function goToIndex() {
	window.location.href = "index.html";
}


function searchLtr(ltr) {
	var srch = ltr;
	lastType = "ltr";
	lastSearch = ltr;
	document.getElementById("resultsList").innerHTML = "";
	document.getElementById("searchResultBanner").innerHTML = ""

	var contactList = "";
	readCookie();

	var tmp = { search: srch, userID: userId };
	var jsonPayload = JSON.stringify(tmp);

	var url = urlBase + '/contacts/searchByUserAndLetter.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.meta.NumberOfResults == 0) {
					document.getElementById("searchResultBanner").innerHTML = "No Results Found";
				}

				else {
					document.getElementById("searchResultBanner").innerHTML = "Search Results:";

					for (var i = 0; i < jsonObject.info.length; i++) {
						var info = jsonObject.info[i];
						contactList += "<li class='unselected' id='";
						contactList += info.ID; //get id specifically
						contactList += "' onclick='select(this.id);'";
						contactList += " firstname='" + info.FirstName;
						contactList += "' lastname='" + info.LastName;
						contactList += "' email='" + info.EmailAddress;
						contactList += "' phone='" + info.PhoneNumber + "'>";
						contactList += info.FirstName + " " + info.LastName; //get first name and last name specifically
						contactList += "</li>";
					}
					document.getElementById("resultsList").innerHTML = contactList;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("searchResultBanner").innerHTML = err.message;
	}

}

function editContact() {
	viewer.setEdit();

	/*var tmp = { ID: document.getElementsByClassName("selected")[0].id };
	var jsonPayload = JSON.stringify(tmp);

	var url = urlBase + '/core/Contact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonObject = JSON.parse(xhr.responseText);
				//assign the reults to the form
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("searchResultBanner").innerHTML = err.message;
	}*/
}



function submitEdit() {

	var fname = document.getElementById("contactFirstName").value; //change to the form id
	if (document.getElementById("contactFirstName").value.length == 0) {
		document.getElementById("createError").innerHTML = "Please Enter a First Name";
		return;
	}
	var lname = document.getElementById("contactLastName").value; //change to the form id
	var email = document.getElementById("contactEmail").value; //change to the form id
	var phone = document.getElementById("phoneNumber").value; //change to the form id

	if(lname == undefined) lname = "";
	if(email == undefined) email = "";
	if(phone == undefined) phone = "";

	var tmp = { ID: document.getElementsByClassName("selected")[0].id, firstName: fname, lastName: lname, emailAddress: email, phoneNumber: phone };
	var jsonPayload = JSON.stringify(tmp);

	var url = urlBase + '/contacts/editContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				reloadSearch();
				viewer.state = viewer.setViewing;
				select(selectedID);

			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("createError").innerHTML = err.message;
	}

}

function reloadSearch() {
	if (lastType == "ltr") {
		searchLtr(lastSearch);
		return;
	}
	else {
		document.getElementById("resultsList").innerHTML = "";

		var contactList = "";
		var srch = lastSearch;
		unselect();
		readCookie();
		var tmp = { search: srch, userID: userId };
		var jsonPayload = JSON.stringify(tmp);
	
		var url = urlBase + '/contacts/search.' + extension;
	
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try {
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					
					var jsonObject = JSON.parse(xhr.responseText);
					if (jsonObject.meta.NumberOfResults == 0) {
						document.getElementById("searchResultBanner").innerHTML = "No Results Found";
					}
	
					else {
						document.getElementById("searchResultBanner").innerHTML = "Search Results:";
	
						for (var i = 0; i < jsonObject.info.length; i++) {
							var info = jsonObject.info[i];
							contactList += "<li class='unselected' id='";
							contactList += info.ID; //get id specifically
							contactList += "' onclick='select(this.id);'";
							contactList += " firstname='" + info.FirstName;
							contactList += "' lastname='" + info.LastName;
							contactList += "' email='" + info.EmailAddress;
							contactList += "' phone='" + info.PhoneNumber + "'>";
							contactList += info.FirstName + " " + info.LastName; //get first name and last name specifically
							contactList += "</li>";
						}
	
						document.getElementById("resultsList").innerHTML = contactList;
					}
				}
			};
			xhr.send(jsonPayload);
		}
		catch (err) {
			document.getElementById("searchResultBanner").innerHTML = err.message;
		}
	
	}
}

const viewer = {
	emptymode: 0,
	viewingmode: 1,
	editmode: 2,
	createmode: 3,
	state: 0,
	clearForm: function() {
		var ids = ["contactFirstName", "contactLastName", "contactEmail", "phoneNumber"];
		for (let i = 0; i < 4; i++) {
			document.getElementById(ids[i]).value = "";
		}
	},
	setEmpty: function() {
		var ids = ["contactFirstName", "contactLastName", "contactEmail", "phoneNumber"];
		for (let i = 0; i < 4; i++) {
			document.getElementById(ids[i]).setAttribute("readonly","");
		}
		document.getElementById("screen-container").setAttribute("state", "emptymode");
		this.state = this.emptymode;
	},
	setViewing: function() {
		var ids = ["contactFirstName", "contactLastName", "contactEmail", "phoneNumber"];
		for (let i = 0; i < 4; i++) {
			document.getElementById(ids[i]).setAttribute("readonly","");
		}
		document.getElementById("screen-container").setAttribute("state", "viewingmode");
		this.state = this.viewingmode;
	},
	setCreate: function() {
		var ids = ["contactFirstName", "contactLastName", "contactEmail", "phoneNumber"];
		for (let i = 0; i < 4; i++) {
			document.getElementById(ids[i]).removeAttribute("readonly");
		}
		document.getElementById("screen-container").setAttribute("state", "createmode");
		this.state = this.createmode;
		document.getElementById("contactFirstName").focus();
	},
	setEdit: function() {
		var ids = ["contactFirstName", "contactLastName", "contactEmail", "phoneNumber"];
		for (let i = 0; i < 4; i++) {
			document.getElementById(ids[i]).removeAttribute("readonly");
		}
		document.getElementById("screen-container").setAttribute("state", "editmode");
		this.state = this.editmode;
		document.getElementById("contactFirstName").focus();
	}
}

function unselect(){
	var temp;
	var temp = document.getElementsByClassName("selected")[0];
	selectedID = temp;
	if(temp != undefined) {
		temp.className = "unselected";
	}
}