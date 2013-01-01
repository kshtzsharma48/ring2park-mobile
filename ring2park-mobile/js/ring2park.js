
// base URL
var baseUrl = 'http://localhost:8080';
	
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

//
// page show actions
//

// login page
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

$('#parking-page').live('pageshow', function () { 
	
	// construct url for viewing bookings
	viewUrl = baseUrl + '/statements/' + localStorage.getItem('j_username') + '/view.json';
	
	$.ajax({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
		complete: function() { $.mobile.hidePageLoadingMsg(); }, //hide spinner
		type: 'GET',  
		url: viewUrl,
		dataType: 'json',
		success: function (bookings) {
			$.each(bookings, function() {
				var id = this.id;
				var description = this.description;
				$("#parking-sessions").append(
					'<li data-corners="false" data-shadow="false" data-iconshadow="true"' +
					' data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c"' +
					' class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child ui-btn-up-c">' +
						'<div class="ui-btn-inner ui-li">' +
							'<div class="ui-btn-text">' +
								'<a class="ui-link-inherit" href="/booking/"' + id + '>' +
								description + 
								'</a>' +
							'</div>' +
							'<span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span>' +
						'</div>' +
					'</li>');
			});		
		},
		error: function (status) {
			console.log("Error retrieving locations for " + localStorage.getItem('j_username'));
		}
	});
	
});

// account page
$('#account-page').live('pageshow', function () { 
	
	// construct url for viewing user
	viewUrl = baseUrl + '/users/' + localStorage.getItem('j_username') + '/view.json';
	
	$.ajax({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
		complete: function() { $.mobile.hidePageLoadingMsg(); }, //hide spinner
		type: 'GET',  
		url: viewUrl,
		dataType: 'json',
		success: function (user) {
			$("#name").val(user.name).val();
			$("#mobile").val(user.mobile).val();
			$("#email").val(user.email).val();
		},
		error: function (status) {
			console.log("Error retrieving user " + localStorage.getItem('j_username'));
		}
	});
	
});

//
// page form submit actions
//
$(document).bind("pageinit", function() {
	
	//bind an event handler to the submit event of the login form
	$('#login-form').live('submit', function (e) {

		//cache the form element for use in this function
		var $this = $(this);

		//prevent the default submission of the form
		e.preventDefault();

		// construct url for logout
		loginUrl = baseUrl + '/users/login.json';
		
		//run an AJAX post request to server-side script, $this.serialize() is the data from the form
		$.ajax({
			beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
			complete: function() { $.mobile.hidePageLoadingMsg(); }, //hide spinner
			type: 'POST',  
			url: loginUrl,
			data: $this.serialize(),
			dataType: 'json',
			success: function (status) {
				if (status.loggedIn) {
					// successful login
					console.log("Succesfully logged in " + $this.find('#j_username').val());
					$.mobile.changePage("pages/parking.html", { transition: "slideup"} );
					if ($this.find('#remember_me').is(':checked')) { 
						// save credentials in local storage
						localStorage.setItem('remember_me', 'true');
						localStorage.setItem('j_username', $this.find('#j_username').val());
						localStorage.setItem('j_password', $this.find('#j_password').val());
					} else {
						// save wanted and clear unwanted credentials from local storage
						localStorage.setItem('j_username', $this.find('#j_username').val());
						localStorage.removeItem('remember_me');
						localStorage.removeItem('j_password');
					}
				} else {
					// failed login
					$('#response').empty().append("<span class='error'>Error logging in: " + status.message + "</span>");
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

		// construct url for logout
		logoutUrl = baseUrl + '/users/logout.json';
		
		$.ajax({
			beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
			complete: function() { $.mobile.hidePageLoadingMsg(); }, //hide spinner
			type: 'POST',  
			url: logoutUrl,
			dataType: 'json',
			success: function (status) {
				if (!status.loggedIn) {
					// successful logout
					document.location.href = "../index.html";
				} else {
					// failed to logout
					alert("Error logging out.");
				}
			},
			error: function (status) {
				console.log("Error logging out user " + localStorage.getItem('j_username'));
			}
		});
		
	});
	
	// bind an event handler to the submit event of the account form
	$('#account-form').live('submit', function (e) {

		if (e.handled !== true) {
			//cache the form element for use in this function
			var $this = $(this);

			//prevent the default submission of the form
			e.preventDefault();

			// construct url for editing user
			editUrl = baseUrl + '/users/' + localStorage.getItem('j_username') + '/edit.json';
			
			//run an AJAX post request to server-side script, $this.serialize() is the data from the form
			$.ajax({
				beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
				complete: function() { $.mobile.hidePageLoadingMsg(); }, //hide spinner
				type: 'POST',  
				url: editUrl,
				data: $this.serialize(),
				dataType: 'json',
				success: function (user) {
					if (user.username) {
						// successful update
						console.log("Sucessfully updated user " + user.username);
						$('div#response').empty().append("<span class='message'>Your account has been successfully updated.</span>");
					} else {
						// failed update
						$('div#response').empty().append("<span class='error'>There was an error updating your account.</span>");
					}
				}
			});
			
		    e.handled = true;
		}
		
		return false;
		
	});
	
});



