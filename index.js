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
		length: {min: 3, max: 16}
	},
    firstname: {
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
	let data = req.body;
	let errors = validPlayerRegistration.validate(data);
	if (errors.length == 0) {
		let player = new Player(data.username, data.firstname, data.surname, data.password, data.rating, data.description);
		league.addPlayer(player);
		res.cookie('username', data.username, {maxAge: 900000, signed: true, httpOnly: true});
		res.json({message: 'success'});
        console.log('new user registered');
		return;
	}
	res.status(400).json({message: 'Invalid format', data: errors});
});

app.get('/update', needsAuth, (req, res)=> {
    res.json({leagueStatus: league.leagueStatus});
});

app.post('/update', needsAuth, (req, res)=> {
	let data = req.body;
	if (data.white in league.players && data.black in league.players) {
        let d = new Date();
        data.date = d.toISOString().substring(0, 10); //yyyy-mm-dd format
		league.addGame(data);
		res.json({message: 'success'});
        console.log('new game added');
		return;
	}
	res.status(400).json({message: 'Invalid format'});	
});

app.post('/status', needsAuth, (req, res)=> {
    let data = req.body;
    if (data.leagueStatus) {
        league.leagueStatus = data.leagueStatus;
        res.json({message: 'success'});
        console.log('status updated');
        return;
    }
    res.status(400).json({message: 'No status supplied'});
});

app.get('/player/:name', (req, res)=> {
    let name = req.params.name;
    if (name in league.players) {
        let player = league.players[name];
        let data = {
            name: name,
            games: league.formatGames(league.getGameHistory(player)),
            fullname: player.firstname + ' ' + player.surname,
            rating: player.rating,
        };
        if (player.description != '') data.description = player.description;
        let currPlayer = req.signedCookies.username;
        if (currPlayer != name && currPlayer in league.players) {
            data.matchup = league.getMatchup(currPlayer, name); 
        }
        res.json(data);
        return;
    }
    res.status(400).json({message: 'Player ' + name + ' not found'});
});

app.get('/games', (req,res)=> {
    res.json({games: league.formatGames(league.recentGames())});
});

app.get('/auth', (req, res)=> {
    let data = {privilege: privilege(req)}
    if (data.privilege == 'user') data.username = req.signedCookies.username;
	res.json(data);
});

function privilege(req) {
    let username = req.signedCookies.username;
	if (username == 'admin') return 'admin'
    else if (username in league.players) return 'user';
    return 'none';
}

function needsAuth(req, res, next) {
	if (privilege(req) == 'admin') {
		return next();
	}
	res.status(400).json('You must be signed in as admin to use this page');	
}
