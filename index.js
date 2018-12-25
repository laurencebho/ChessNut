const League = require('./classes/league.js');
const Player = require('./classes/player.js');
const Schema = require('validate');
const express = require('express');
const app = express();
const http = require('http').Server(app);
//const pug = require('pug');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = 5000;

let league = new League();

http.listen(port, (err) => {
	if (err) return console.log(err);
	return console.log('Listening on port ' + port);
});

app.use(express.static('public'));
app.use(express.static('views'));
//app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser('secret'));

app.get('/', (req, res)=> {
  res.sendFile('index.html');
});
const validPlayerRegistration = new Schema({
	username: {
		type: String,
		required: true,
		length: {min: 3, max: 16}
	},
	password: {
		type: String,
		required: true,
		length: {min: 5, max: 20}
	},
	rating: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: false,
		length: {max: 500}
	}
});
const validLoginFormat = new Schema({
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

function validateLogin(username, password) {
	if (username == 'admin' && password == 'guest') return true;
	else {
		return league.validate(username, password);
	}
}

app.post('/login', (req, res)=> {
	let data = req.body;
	console.log(data);
	let errors = validLoginFormat.validate(data);
	if (errors.length == 0) {
		if (validateLogin(data.username, data.password)) {
			console.log("login success");
			res.cookie('username', data.username, {maxAge: 900000, signed: true, httpOnly: true});
			res.json({message: 'login success'});
			return;
		}
	}
	res.status(400).json({message: 'Incorrect credentials, please try again'});
});

app.get('/logout', (req, res)=> {
	console.log('logging out');
	res.clearCookie('username');
	res.json({message: 'logout success'});
});

app.post('/register', (req, res)=> {
	console.log(req.body);
	let data = req.body;
	console.log(data);
	let errors = validPlayerRegistration.validate(data);
	console.log()
	if (errors.length == 0) {
		let player = new Player(data.username, data.password, data.rating, data.description);
		league.addPlayer(player);
		res.cookie('username', data.username, {maxAge: 900000, signed: true, httpOnly: true});
		res.json({message: 'success'});
		return;
	}
	res.status(400).json({message: 'Invalid format', data: errors});
});

app.post('/update', needsAuth, (req, res)=> {
	console.log(req.body);
	let data = req.body;
	console.log(data);
	if (data.white in league.players && data.black in league.players) {
		league.addGame(data);
		res.json({message: 'success'});
		return;
	}
	res.status(400).json({message: 'Invalid format'});	
});

app.get('/auth', (req, res)=> {
	res.json({loggedIn: loggedIn(req)});
});

function loggedIn(req) {
	return (req.signedCookies.username == 'admin' || req.signedCookies.username in league.players);
}

function needsAuth(req, res, next) {
	if (loggedIn(req)) {
		return next();
	}
	res.status(400).json('You must be signed in as admin to view this page');	
}