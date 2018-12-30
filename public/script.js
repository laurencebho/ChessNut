$.ajaxSetup({contentType: 'application/json; charset=utf-8', dataType: 'json'});

$.hashroute('middleware', function(e) { //always runs
	$.get("/auth", (data)=> {
        let privilege = data.privilege;
        if (privilege == 'admin') e.admin = true;
        if (privilege == 'user') {
            setMenu(privilege, data.username);
        }
        else {
            setMenu(privilege);
        }
	    this.next();
	})
});

$(document).hashroute("/", ()=> {
    $.ajax({
        method: "GET",
        url: "/home",
        success: (data)=> { //data to render homepage
            console.log(data);
            display("leaderboard", data);
        }
    });
});


$(document).hashroute("/login", ()=> {
	display("login");
	$(document).off("submit", "#loginform").on("submit", "#loginform", (e)=> {
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
	$(document).off("submit", "#registrationform").on("submit", "#registrationform", (e)=> {
		$.ajax({
			method: "POST",
			url: "/register",
			data: JSON.stringify({
                username: $("#username").val(),
                firstname: $("#firstname").val(),
                surname: $("#surname").val(),
                password: $("#password").val(),
                rating: Number($("#rating").val()),
                description: $("#description").val()
            }),
			success: (data)=> { //data to render homepage
				console.log("registered and logged in");
				console.log(data);
				window.location.hash = '/';
			}
		});
		return false;
	});
});

$(document).hashroute("/update", (e)=> {
    if (!e.admin) {
        display("error400");
    }
    else {
        display("update");
        $(document).off("submit", "#gameform").on("submit", "#gameform", (e)=> {
            let gameResult;
            switch($("#gameresult").val()) {
                case "w":
                    gameResult = [1, 0];
                    break;
                case "b":
                    gameResult = [0, 1];
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
    }
});

$(document).hashroute("/logout", ()=> {
	$.get("/logout", (data)=> {
		console.log("logged out");
		window.location.hash = '/';
	});
});

$(document).hashroute("/player/:name", (e)=> {
    $.get("/player/" + e.params.name, (data)=> {
        display("player", data);
    });
});

$(document).hashroute("/games", ()=> {
    $.get("/games", (data)=> {
        display("games", data);
    });
});

function display(id, data) {
	let template = $("#" + id).html();
	let rendered = Mustache.render(template, data);
	$("#main-content").html(rendered);
}

function setMenu(privilege, username) {
    $("#me-item").attr("hidden", true);
    $("#update-item").attr("hidden", true);
    $("#register-item").attr("hidden", true);
    $("#login-item").removeAttr("hidden");
    if (privilege == 'admin' || privilege == 'user') {
        $("#login-link").attr("href", "#/logout");
        $("#login-link").text("logout");
        if (privilege == 'admin') {
            $("#update-item").removeAttr("hidden");
        }
        if (privilege == 'user') {
            $("#me-item").removeAttr("hidden");
            $("#me-link").attr("href", "#/player/" + username);
        }
    }
    else {
        $("#login-link").attr("href", "#/login");
        $("#login-link").text("login");			
        $("#register-item").removeAttr("hidden");
    }
}
