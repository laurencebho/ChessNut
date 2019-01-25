$.ajaxSetup({contentType: 'application/json; charset=utf-8', dataType: 'json'});

$.hashroute('middleware', function(e) { //always runs
	$.get("/auth", (data)=> {
        let privilege = data.privilege;
        if (privilege == 'admin') e.admin = true;
        if (privilege == 'user') {
            setMenu(privilege, data.username);
            e.username = data.username;
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
				window.location.hash = '/';
			},
            error: (e)=> {
                displayAlert("loginform", e.responseJSON);
            }
		});
		return false; //prevent reloading of page
	});
});

$(document).hashroute("/register", ()=> {
	display("register");
	$(document).off("submit", "#registrationform").on("submit", "#registrationform", (e)=> {
        if ($("#password").val() != $("#confirm-password").val()) displayAlert("registrationform", {type: "error", message: "passwords do not match"});
        else {
            $.ajax({
                method: "POST",
                url: "/register",
                data: JSON.stringify({
                    username: $("#username").val(),
                    forename: $("#forename").val(),
                    surname: $("#surname").val(),
                    password: $("#password").val(),
                    rating: Number($("#rating").val()),
                    description: $("#description").val()
                }),
                success: (data)=> { //data to render homepage
                    console.log("registered and logged in");
                    window.location.hash = '/';
                },
                error: (e)=> {
                    displayAlert("registrationform", e.responseJSON);
                }
            });
        }
		return false;
	});
});

$(document).hashroute("/update", (e)=> {
    if (!e.admin) {
        display("error403");
    }
    else {
        $.get("/update", (data)=> {
            display("update", data);
            $(document).off("submit", "#gameform").on("submit", "#gameform", ()=> {
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
                        displayAlert("gameform", data);
                    },
                    error: (e)=> {
                        displayAlert("gameform", e.responseJSON);
                    }
                });
                return false;
            });

            $(document).off("submit", "#statusform").on("submit", "#statusform", ()=> {
                $.ajax({
                    method: "POST",
                    url: "/status",
                    data: JSON.stringify({leagueStatus: $("#status").val()}),
                    success: (data)=> {
                        console.log("status updated");
                        displayAlert("statusform", data);
                    },
                    error: (e)=> {
                        displayAlert("statusform", e.responseJSON);
                    }
                });
                return false;
            });
        });
    }
});

$(document).hashroute("/logout", ()=> {
	$.get("/logout", (data)=> {
		console.log("logged out");
		window.location.hash = '/';
	});
});

$(document).hashroute("/player/:username", (e)=> {
    $.get("/player/" + e.params.username, (data)=> {
        display("player", data);
    });
});

$(document).hashroute("/player/:username/edit", (e)=> {
    //if logged in user is on their own profile page, allow editing
    if (e.params.username == e.username || e.admin) { 
        $.get("/edit/" + e.params.username, (data)=> {
            display("edit", data);
        });
    }
    else {
        display("error403");
    }
	$(document).off("submit", "#editform").on("submit", "#editform", ()=> {
        if ($("#password").val() != $("#confirm-password").val()) displayAlert("editform", {type: "error", message: "passwords do not match"});
        else {
            $.ajax({
                method: "POST",
                url: "/edit/" + e.params.username,
                data: JSON.stringify({
                    forename: $("#forename").val(),
                    surname: $("#surname").val(),
                    password: $("#password").val(),
                    rating: Number($("#rating").val()),
                    description: $("#description").val()
                }),
                success: (data)=> {
                    displayAlert("editform", data);
                },
                error: (e)=> {
                    displayAlert("editform", e.responseJSON);
                }
            });
        }
        return false;
    });
});

$(document).hashroute("/games", ()=> {
    $.get("/games", (data)=> {
        display("games", data);
    });
});

$(document).hashroute('404', function(e) {
    display("error404");
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

function displayAlert(form, data) {
    $(".pure-alert").remove(); //clear existing alerts
    let rendered = Mustache.render($("#alert").html(), data);
    $("#" + form).after(rendered);
}
