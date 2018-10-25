$.ajaxSetup({contentType: 'application/json; charset=utf-8', dataType: 'json'});

$.hashroute("/login", ()=> {
	$("#main-content").empty().append("loginform.pug");
	$("#loginform").submit(()=> {

	})
})