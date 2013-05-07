
// base URL
var baseUrl = 'http://10.0.1.13:8080';

// viewport width and height
var viewport = {
	width  : $(window).width(),
	height : $(window).height()
};	

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

//booking page
$('#book-page').live('pageshow', function () { 
	
	var id;
	var query = $(this).data("url").split("?")[1];
	if (query)
		id = query.replace("id=","");
	else
		id = "";
	
	if (id.length > 0) {
		//$('#location-id-div').hide();
		
		console.log("Booking parking for " + id);		
		// construct url for getting parking location
		locationsUrl = baseUrl + '/locations/' + id + '/details.json';
		
		$.ajax({
			beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
			complete: function() { $.mobile.hidePageLoadingMsg(); }, //hide spinner
			type: 'GET',  
			url: statementUrl,
			dataType: 'json',
			success: function (location) {
				$("#location").val(location.name).val();
			},
			error: function (status) {
				console.log("Error retrieving location " + id);
			}
		});
	} else {
		//$('#location-div').hide();
		
		// get parking locations
		var criteria = "";
		//locationsUrl = baseUrl + '/locations/search.json?criteria=' + criteria;
		locationsUrl = baseUrl + '/locations/find.json';
		
		$.ajax({
			beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
			complete: function() { $.mobile.hidePageLoadingMsg(); }, //hide spinner
			type: 'GET',  
			url: locationsUrl,
			dataType: 'json',
			success: function (locations) {
				// create drop down list
				$.each(locations, function(i, location) {		
					$("#location-id").append(
						'<option value="' + location.id + '">' + location.name + ', ' + location.address + '</option>'
					);
				});
			},
			error: function (status) {
				console.log("Error retrieving locations with criteria " + criteria);
			}
		});
		
		// get users vehicles
		vehiclesUrl = baseUrl + '/vehicles/' + localStorage.getItem('j_username') + '/view.json';
		
		$.ajax({
			beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
			complete: function() { $.mobile.hidePageLoadingMsg(); }, //hide spinner
			type: 'GET',  
			url: vehiclesUrl,
			dataType: 'json',
			success: function (vehicles) {
				// create drop down list
				$.each(vehicles, function(i, vehicle) {		
					$("#vehicle-id").append(
						'<option value="' + vehicle.id + '">' + vehicle.license + '</option>'
					);
				});
			},
			error: function (status) {
				console.log("Error retrieving users vehicles.");
			}
		});
		
		// get users payment cards
		cardsUrl = baseUrl + '/cards/' + localStorage.getItem('j_username') + '/view.json';
		
		$.ajax({
			beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
			complete: function() { $.mobile.hidePageLoadingMsg(); }, //hide spinner
			type: 'GET',  
			url: cardsUrl,
			dataType: 'json',
			success: function (cards) {
				// create drop down list
				$.each(cards, function(i, card) {		
					var aNumber = '************' + card.number.substring(11);
					$("#card-id").append(
						'<option value="' + card.id + '">' + card.type + ' ' + aNumber + '</option>'
					);
				});
			},
			error: function (status) {
				console.log("Error retrieving users vehicles.");
			}
		});

	}
	
});

$('#sessions-page').live('pageshow', function () { 
	
	// construct url for viewing bookings
	viewUrl = baseUrl + '/bookings/' + localStorage.getItem('j_username') + '/view.json';
	
	$.ajax({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
		complete: function() { $.mobile.hidePageLoadingMsg(); }, //hide spinner
		type: 'GET',  
		url: viewUrl,
		dataType: 'json',
		success: function (sessions) {
			$.each(sessions, function() {				
				$("#parking-sessions").append(
					'<li data-wrapperels="div" data-corners="false" data-shadow="false" data-iconshadow="true" ' +
					' data-icon="false" data-iconpos="right" data-theme="c"' +
					' class="ui-btn ui-btn-icon-right ui-li ui-li-has-alt ui-li-has-thumb ui-first-child ui-btn-up-c">' +
						'<div class="ui-btn-inner ui-li ui-li-has-alt">' +
							'<div class="ui-btn-text">' +
							    '<a class="ui-link-inherit" href="../pages/statement.html?id=' + this.id + '">' +
									'<h3 class="ui-li-heading">' + this.vehicle.license + '</h3>' +
									'<p class="ui-li-desc">' + this.description + '</p>' +
								'</a>' +
							'</div>' +
						'</div>' +
						'<a aria-owns="#book" aria-haspopup="true" data-theme="c" data-iconpos="notext"' + 
							'data-icon="false" data-wrapperels="span" data-iconshadow="true" data-shadow="false"' + 
							'data-corners="false" class="ui-li-link-alt ui-btn ui-btn-up-c ui-btn-icon-notext"' + 
							'title="Park Again" href="#book" data-rel="popup" data-position-to="window"' + 
							'data-transition="pop">' +
							'<span class="ui-btn-inner">' +
								'<span class="ui-btn-text"></span>' +
								'<span class="ui-btn ui-btn-up-d ui-shadow ui-btn-corner-all ui-btn-icon-notext" title=""' + 
									'data-theme="d" data-iconpos="notext" data-icon="custom" data-wrapperels="span"' +
									'data-iconshadow="true" data-shadow="true" data-corners="true">' +
									'<span class="ui-btn-inner">' +
										'<span class="ui-btn-text">Park Again</span>' +
										'<span class="ui-icon ui-icon-gear ui-icon-shadow">&nbsp;</span>' +
									'</span>' + 
								'</span>' +	
							'</span>' +
						'</a>' +
					'</li>');
			});		
		},
		error: function (status) {
			console.log("Error retrieving parking sessions for " + localStorage.getItem('j_username'));
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

//statement page
$('#statement-page').live('pageshow', function () { 
	
	var query = $(this).data("url").split("?")[1];
	var id = query.replace("id=","");
	console.log("Viewing parking statement " + id);
	
	// construct url for viewing statement
	statementUrl = baseUrl + '/statements/' + id + '/details.json';
	
	$.ajax({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
		complete: function() { $.mobile.hidePageLoadingMsg(); }, //hide spinner
		type: 'GET',  
		url: statementUrl,
		dataType: 'json',
		success: function (statement) {
			$("#location").val(statement.location.name).val();
			$("#start-date").val(statement.startDate).val();
			$("#end-date").val(statement.endDate).val();
			$("#cost").val(statement.total).val();
		},
		error: function (status) {
			console.log("Error retrieving statement " + id);
		}
	});
	
});

// map page
$('#map-page').live('pageshow', function() {
	$('#map_canvas').gmap('refresh');
});
$('#map-page').live("pageinit", function() {
	$('#map_canvas').width(viewport.width);
	$('#map_canvas').height(viewport.height);
	$('#map_canvas').gmap().bind('init', function(evt, map) {
		var geoLoc = geoLocation.longitude + "," + geoLocation.latitude;
		console.log("Current geolocation is " + geoLoc);
        $('#map_canvas').gmap({ 'center': geoLoc,'scrollwheel':false});
        $('#map_canvas').gmap('option', 'mapTypeId', google.maps.MapTypeId.SATELLITE);
        $('#map_canvas').gmap('option', 'zoom', 7);
		$('#map_canvas').gmap('addMarker', {'position': geoLoc, 'bounds': true}).click(function() {
			$('#map_canvas').gmap('openInfoWindow', {'content': 'You are here!'}, this);
		});
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
					$.mobile.changePage("pages/sessions.html", { transition: "slideup"} );
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
	
	// bind an event handler to the submit event of the booking form
	$('#book-form').live('submit', function (e) {

		if (e.handled !== true) {
			//cache the form element for use in this function
			var $this = $(this);

			//prevent the default submission of the form
			e.preventDefault();

			// construct url for editing user
			bookingUrl = baseUrl + '/bookings/' + localStorage.getItem('j_username') + '/add.json';
			
			//run an AJAX post request to server-side script, $this.serialize() is the data from the form
			$.ajax({
				beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //show spinner
				complete: function() { $.mobile.hidePageLoadingMsg(); }, //hide spinner
				type: 'POST',  
				url: bookingUrl,
				data: $this.serialize(),
				dataType: 'json',
				success: function (booking) {
					if (booking.id) {
						// successful booking
						console.log("Sucessfully created booking " + booking.id);
						// TODO: show success dialog
						$.mobile.changePage("pages/sessions.html", { transition: "slideup"} );
					} else {
						// failed booking
						$('div#response').empty().append("<span class='error'>There was an error creating your booking.</span>");
					}
				}
			});
			
		    e.handled = true;
		}
		
		return false;
		
	});
	
	// bind an event handler to the submit event of the statement form
	$('#statement-form').live('submit', function (e) {

		if (e.handled !== true) {
			//cache the form element for use in this function
			var $this = $(this);
			console.log($this);

			//prevent the default submission of the form
			e.preventDefault();
			
			$.mobile.changePage("pages/book.html?id=", { transition: "slideup"} );
			
		    e.handled = true;
		}
		
		return false;
		
	});
	
	//bind an event handler to the park again button
	$('#book-again-btn').bind("click", function (e) {
		
		//prevent the default submission of the form
		e.preventDefault();
		
		$.mobile.changePage("../pages/book.html?id=", { transition: "slideup"} );
		console.log("Booking again");
		
	});
	
});



