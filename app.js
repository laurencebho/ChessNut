const League = require('./classes/league.js');
const Player = require('./classes/player.js');
const Schema = require('validate');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = 5000;

let league = new League();
league.addDefaultPlayers();

http.listen(port, (err) => {
	if (err) return console.log(err);
	return console.log('Listening on port ' + port);
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser('secret'));

app.get('/home', (req, res)=> {
    res.json({leaderboard: league.calculateLeaderboard(), leagueStatus: league.leagueStatus});
});

const validPlayerRegistration = new Schema({
	username: {
		type: String,
		required: true,
		length: {min: 3, max: 20}
	},
    forename: {
		type: String,
		required: true,
		length: {max: 16}
    },
    surname: {
		type: String,
		required: true,
		length: {max: 16}
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
		length: {min: 3, max: 20}
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
	let errors = validLoginFormat.validate(data);
	if (errors.length == 0) {
		if (validateLogin(data.username, data.password)) {
			console.log("login success");
			res.cookie('username', data.username, {maxAge: 900000, signed: true, httpOnly: true});
			res.json({type: 'success', message: 'Logged in successfully'});
			return;
		}
		errors.push({message: "invalid login credentials"});
		console.log(errors);
	}
	res.status(400).json({type: 'error', message: errors[0].message});
});

app.get('/logout', (req, res)=> {
	console.log('logging out');
	res.clearCookie('username');
	res.json({message: 'logout success'});
});

app.post('/register', (req, res)=> {
	let data = req.body;
	let errors = validPlayerRegistration.validate(data);
	if (errors.length == 0) {
		if (!(league.players.hasOwnProperty(data.username)) && (data.username != 'admin')) {
			let player = new Player(data.username, data.forename, data.surname, data.password, data.rating, data.description);
			league.addPlayer(player);
			res.cookie('username', data.username, {maxAge: 900000, signed: true, httpOnly: true});
			res.json({type: 'success', message: 'Registered and logged in successfully'});
	        console.log('new user registered');
			return;
		}
		errors.push({message: "someone with this username already exists"});
	}
	res.status(400).json({type: 'error', message: errors[0].message});
});

app.get('/update', needsAuth, (req, res)=> {
    res.json({leagueStatus: league.leagueStatus});
});

app.post('/update', needsAuth, (req, res)=> {
	let data = req.body;
	if (league.players.hasOwnProperty(data.white) && league.players.hasOwnProperty(data.white) && data.white != data.black) {
        let d = new Date();
        data.date = d.toISOString().substring(0, 10); //yyyy-mm-dd format
		league.addGame(data);
		res.json({
			type: 'success',
			message: 'Game ' + data.white + ' vs ' + data.black + ' added'
			});
        console.log('new game added');
		return;
	}
	res.status(400).json({type: 'error', message: 'cannot add game: players are invalid'});	
});

app.post('/status', needsAuth, (req, res)=> {
    let data = req.body;
    if (data.leagueStatus) {
        league.leagueStatus = data.leagueStatus;
        res.json({type: 'success', message: 'status updated'});
        console.log('status updated');
        return;
    }
    res.status(400).json({type: 'error', message: 'no status supplied'});
});

app.get('/:type(player|people)/:username', (req, res)=> { 
    let username = req.params.username;
    console.log(username);
    if (league.players.hasOwnProperty(username)) {
        let player = league.players[username];
        let data = {
            username: username,
            games: league.formatGames(league.getGameHistory(player)),
            forename: player.forename,
            surname: player.surname,
            rating: player.rating
        };
        if (player.description != '') data.description = player.description;
        let currPlayer = req.signedCookies.username;
        if (currPlayer != username && league.players.hasOwnProperty(currPlayer)) {
            data.matchup = league.getMatchup(currPlayer, username); 
        }
        res.json(data);
        return;
    }
    res.status(400).json({message: 'Player ' + username + ' not found'});
});

app.get('/games', (req,res)=> {
    res.json({games: league.formatGames(league.recentGames())});
});

app.get('/auth', (req, res)=> {
    let data = {privilege: privilege(req)}
    if (data.privilege == 'user') data.username = req.signedCookies.username;
	res.json(data);
});

app.route('/people')
	.get((req, res)=> {
		res.json(league.players);
	})
	.post((req, res)=> {
		if (req.headers.access_token != 'concertina') {
			res.status(403).json({message: 'valid access token is required'});
			return;
		}
		if (req.headers.username && req.headers.forename && req.headers.surname) {
			let data = {
				username: req.headers.username,
				forename: req.headers.forename,
				surname: req.headers.surname,
				password: 'guest',
				rating: 1200,
				description: ''
			};
			let errors = validPlayerRegistration.validate(data);
			if ((errors.length == 0) && !(league.hasOwnProperty(data.username))) {
				league.addPlayer(data.username, data.forename, data.surname, data.password, data.rating, data.description);
				res.json({message: 'new user registered'});
				return;
			}
		}
		res.status(400).end('invalid request');
	});

function privilege(req) {
    let username = req.signedCookies.username;
	if (username == 'admin') return 'admin'
    else if (league.players.hasOwnProperty(username)) return 'user';
    return 'none';
}

function needsAuth(req, res, next) {
	if (privilege(req) == 'admin') {
		return next();
	}
	res.status(400).json({message: 'You must be signed in as admin to use this page'});	
}

module.exports = app;