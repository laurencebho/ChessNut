const Schema = require('validate');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const pug = require('pug');
const router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

const port = 5000;
http.listen(port, (err) => {
	if (err) return console.log(err);
	return console.log('Listening on port ' + port);
});

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views',  __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser('secret'));

app.get('/', (req, res)=> {
  res.render('index.pug');
});
//const users = {'admin': new User('admin', ...)};
const admin = new Schema({
	username: {
		type: String,
		required: true,
		length: {min: 3, max: 16}
	},
	password: {
		type: String,
		required: true,
		length: {min: 5, max: 20}
	}
});

app.get('/partials/login', (req, res)=> {
		console.log('received request for partial');
		res.render('loginform.pug');
});

app.post('/login', (req, res)=> {
	let data = {username: req.body.username, password: req.body.password};
	console.log(data);
	let errors = admin.validate(data);
	if (errors.length == 0) {
		if (data.username == 'admin' && data.password == 'guest') {
			console.log("login success");
			res.cookie('username', data.username, {maxAge: 18000, signed: true, httpOnly: true});
			res.json({page: 'home'
			});
			return;
		}
	}
	res.status(400).json({message: 'Incorrect credentials, please try again'});
});

app.get('/logout', (req, res)=> {
	res.clearCookie('username');
	res.json({
	});
});

app.get('/create', loggedIn, (req, res)=> {
	res.json({});
});


function loggedIn(req, res, next) {
	if (req.signedCookies.username == 'admin') {
		return next();
	}
	res.status(400).json('You must be signed in as admin to view this page');	
}

//middleware to check if authentication needed