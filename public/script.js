$.ajaxSetup({contentType: 'application/json; charset=utf-8', dataType: 'json'});

$.hashroute('middleware', function(e) { //always runs
	$.get("/auth", (data)=> {
		if (data.loggedIn) {
			$("#login-link").attr("href", "./#/logout");
			$("#login-link").text("logout");
		}
		else {
			$("#login-link").attr("href", "./#/login");
			$("#login-link").text("login");			
		}
	})
	this.next();
});

$(document).hashroute("/", ()=> {
	display("home");
});


$(document).hashroute("/login", ()=> {
	display("login");
	$(document).on("submit", "#loginform", (e)=> {
		console.log("submitting form");
		$.ajax({
			method: "POST",
			url: "/login",
			data: JSON.stringify({username: $("#username").val(), password: $("#password").val()}),
			success: (data)=> { //data to render homepage
				console.log("logged in");
				console.log(data);
				window.location.hash = '/';
			}
		});
		return false; //prevent reloading of page
	});
});

$(document).hashroute("/register", ()=> {
	display("register");
	$(document).on("submit", "#registrationform", (e)=> {
		$.ajax({
			method: "POST",
			url: "/register",
			data: JSON.stringify({username: $("#username").val(), password: $("#password").val(), rating: Number($("#rating").val()), description: $("#description").val()}),
			success: (data)=> { //data to render homepage
				console.log("registered and logged in");
				console.log(data);
				window.location.hash = '/';
			}
		});
		return false;
	});
});

$(document).hashroute("/update", ()=> {
	display("update");
	$(document).on("submit", "#gameform", (e)=> {
		let gameResult;
		switch($("#gameresult").val()) {
			case "w":
				gameResult = [1, 0];
				break;
			case "b":
				gameResult = [0, 0];
				break;
			case "d":
				gameResult = [0.5, 0.5];
				break;
			default:
				break;
		}
		$.ajax({
			method: "POST",
			url: "/update",
			data: JSON.stringify({white: $("#white").val(), black: $("#black").val(), result: gameResult}),
			success: (data)=> { //data to render homepage
				console.log("game added");
				console.log(data);
			}
		});
	return false;
	});
});

$(document).hashroute("/logout", ()=> {
	$.get("/logout", (data)=> {
		console.log(data);
		console.log("logged out");
		window.location.hash = '/';
	});
});

function display(id, data) {
	let template = $("#" + id).html();
	Mustache.parse(template);
	let rendered = Mustache.render(template, data);
	$("#main-content").html(rendered);
}