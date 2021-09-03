var urlBase = 'http://people-dex.xyz/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	//var tmp = {login:login,password:password};
	var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "dex.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
 }

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function createContactField(){
		document.getElementById("createForm").style.display = 'inline-block';
		document.getElementById("searchBox").style.visibility = 'hidden';
		document.getElementById("createButton").style.visibility = 'hidden';
		document.getElementById("letterSearch").style.visibility = 'hidden';
		document.getElementById("header").innerHTML = "Enter Contact Information:";
	}

	function cancelCreate(){
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

	function createContact(){
		var fname = document.getElementById("contactFirstName").value;
		var lname = document.getElementById("contactLastName").value;
		var email = document.getElementById("contactEmail").value;
		var phone = document.getElementById("phoneNumber").value;
		cancelCreate();
		document.getElementById("searchBox").style.visibility = 'hidden';
		document.getElementById("createButton").style.visibility = 'hidden';
		document.getElementById("letterSearch").style.visibility = 'hidden';		
		document.getElementById("header").style.display = 'none';
		document.getElementById("success").innerHTML = 'Alright! ' + fname + ' ' + lname + ' was caught! New PeopleDex data will be added for ' + fname + ' ' + lname + '!';
		setTimeout(cancelCreate, 3000);
	}

	function deleteContact(){
		var del = confirm("Once released, fname is gone forever. Ok?");

		if(del==false){
			return;
		}
		else{
			cancelCreate();
			document.getElementById("searchBox").style.visibility = 'hidden';
			document.getElementById("createButton").style.visibility = 'hidden';
			document.getElementById("letterSearch").style.visibility = 'hidden';		
			document.getElementById("header").style.display = 'none';
			//delete here
			document.getElementById("success").innerHTML = 'fname lname was released outside.'
			setTimeout(cancelCreate, 3000);
		}
	}

	function select(id){
		var text1 = "Fake Contact"
		var text2 = "Selected Fake Contact"
		var original;

		var original = document.getElementsByClassName("selected")[0];
		//var text = document.getElementsByClassName("selected").Node.textContent.toString().replace(/<[^>]*>?/gm, '');
		if(original != undefined){
			original.className="unselected";
		}
		document.getElementById(id).className="selected";
		//var text = document.getElementsByClassName("selected").Node.textContent.toString().replace(/<[^>]*>?/gm, '');
		
	}
 
 function searchBox()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	var contactList = "";

	var tmp = {search:srch,userId:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
        document.getElementById("resultsList").innerHTML = ""
				var jsonObject = JSON.parse( xhr.responseText );
        if(jsonObject.results.length == 0){
          document.getElementById("searchResultBanner").innerHTML = "No Results Found";
        }
        
        else{
        document.getElementById("searchResultBanner").innerHTML = "Search Results:";

				for( var i=0; i<jsonObject.results.length; i++ )
				{
          contactList += "<li class='unselected' id='";
					contactList += jsonObject.getInt("contactID"); //get id specifically
          contactList += " onclick='select(this.id);'>";
          contactList += jsonObject.getString("firstName") + " " + jsonObject.getString("lastName"); //get first name and last name specifically
          contactList += "</li>";
				}

				document.getElementById("contactSearchResult").innerHTML = contactList;
			}
      }
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResultBanner").innerHTML = err.message;
	}

}

function register(){
  var newFName = document.getElementbyId("firstName");
    if(newFName.value.length == 0){
      document.getElementbyId("registerError"),innerHTML = "Please enter your first name";
      return;
    }
  var newLname = document.getElementbyId("lastName");
  if(newLName.value.length == 0){
      document.getElementbyId("registerError"),innerHTML = "Please enter your last name";
      return;
    }
  var newUser = document.getElementbyId("loginName");
  if(newUser.value.length == 0){
      document.getElementbyId("registerError"),innerHTML = "Please enter a Username";
      return;
    }
  var newPass = document.getElementbyId("loginPassword");
    if(newPass.value.length == 0){
      document.getElementbyId("registerError"),innerHTML = "Please enter a Password";
      return;
    }
    
    var hash = md5( newPass );
    var tmp = {firstName: newFName, lastName: newLName, login:newUser,password:hash};
	  var jsonPayload = JSON.stringify( tmp );
    
    var url = urlBase + '/Register.' + extension;
    
    var xhr = new XMLHttpRequest();
	  xhr.open("POST", url, true);
  	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
   
   try
	  {
		  xhr.onreadystatechange = function()
	  	{
		  	if (this.readyState == 4 && this.status == 200)
			  {
           getElementById("registrationBox").display = "none";
           getElementById("boxBanner").innerHTML = "Registration Successful!";
           setTimeout(goToIndex(), 3000);
  
        }
      };
    xhr.send(jsonPayload);
    }
	}
	catch(err)
	{
		document.getElementById("registerError").innerHTML = err.message;
	}
}


function goToIndex(){
  window.location.href = "index.html";
}












