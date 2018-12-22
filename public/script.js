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
	$(document).off().on("submit", "#loginform", (e)=> {
		e.stopImmediatePropagation();
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