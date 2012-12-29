
// If you want to prevent dragging, uncomment this section
/*
 function preventBehavior(e) 
 { 
 e.preventDefault(); 
 };
 document.addEventListener("touchmove", preventBehavior, false);
 */

/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
 see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
 for more details -jm */
/*
 function handleOpenURL(url)
 {
 // TODO: do something with the url passed in.
 }
 */

function onBodyLoad()
{		
    document.addEventListener("deviceready", onDeviceReady, false);
}

/* When this function is called, Cordova has been initialized and is ready to roll */
/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
 see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
 for more details -jm */
function onDeviceReady()
{
    // do your thing!
    //navigator.notification.alert("Cordova is working")
}

$(document).bind("pageinit", function() {
	
	//bind an event handler to the submit event of the login form
	$('#login-form').live('submit', function (e) {

		//cache the form element for use in this function
		var $this = $(this);

		//prevent the default submission of the form
		e.preventDefault();

		//run an AJAX post request to server-side script, $this.serialize() is the data from the form
		$.ajax({
			beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
			complete: function() { $.mobile.hidePageLoadingMsg() }, //hide spinner
			type: 'POST',  
			url: $this.attr('action'),
			data: $this.serialize(),
			dataType: 'json',
			success: function (status) {
				if (status.loggedIn) {
					// successful login
					console.log("succesfully logged in as " + $this.find('#j_username').val());
					$.mobile.changePage("pages/parking.html", { transition: "slideup"} );
					if ($this.find('#remember_me').is(':checked')) { 
						// save credentials in local storage
						localStorage.setItem('remember_me', 'true');
						localStorage.setItem('j_username', $this.find('#j_username').val());
						localStorage.setItem('j_password', $this.find('#j_password').val());
					} else {
						// clear credentials from local storage
						localStorage.removeItem('remember_me');
						localStorage.removeItem('j_username');
						localStorage.removeItem('j_password');
					}
				} else {
					// failed login
					$('#response').empty().append("<span class='error'>" + status.message + "</span>");
				}
			}
		});
	});
	
	//bind an event handler to the logout button
	$('#logout-btn').bind("click", function (e) {
		
		//prevent the default submission of the form
		e.preventDefault();
		
		// clear remember_me so we don't auto login
		localStorage.removeItem('remember_me');

		$.ajax({
			beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
			complete: function() { $.mobile.hidePageLoadingMsg() }, //hide spinner
			type: 'POST',  
			url: 'http://localhost:8080/users/logout.json',
			dataType: 'json',
			success: function (status) {
				if (!status.loggedIn) {
					// successful logout
					document.location.href = "../index.html";
				} else {
					// failed to logout
					alert("Error logging out");
				}
			},
			error: function (status) {
				console.log("Error logging out");
			}
		});
		
	});
	
});

$('#login-page').live('pageshow', function () { 
	
	// do we have remembered credentials
	username = localStorage.getItem('j_username');
	if (username != null && username.length) {
		// set field value
		$("#j_username").val(username).val();
	}
	password = localStorage.getItem('j_password');
	if (password != null && password.length) {
		// set field value
		$("#j_password").val(password).val();
	}
	remember_me = localStorage.getItem('remember_me');
	if (remember_me != null && remember_me == 'true') {
		$("#remember_me").attr("checked",true).checkboxradio("refresh");
		// automatically submit the form
		$('#login-form').submit();
	}
	
});

$('#account-page').live('pageshow', function () { 
	
	$.ajax({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
		complete: function() { $.mobile.hidePageLoadingMsg() }, //hide spinner
		type: 'POST',  
		url: 'http://localhost:8080/users/view.json',
		dataType: 'json',
		success: function (user) {
		
		},
		error: function (status) {
			console.log("Error retrieving user");
		}
	});
	
});
