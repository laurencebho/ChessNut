$.ajaxSetup({contentType: 'application/json; charset=utf-8', dataType: 'json'});

$.hashroute("/login", ()=> {
	$("#main-content").empty();
	$.get("/partials/login", (data)=> {
		$("#main-content").html(data);
	}, 'html');

	$("#login-button").click(()=> {
		console.log("submitting form");
		$.ajax({
			method: "POST",
			url: "/login",
			data: {username: $("#username").value(), password: $("#password").value()},
			success: (data)=> {
				renderHome(data);
			}
		});
	});
});

function renderHome(data) {
	console.log(data);
}