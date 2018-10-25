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
app.use(cookieParser());

app.get('/', (req, res)=> {
  res.render('index.pug');
})
//const users = {'admin': new User('admin', ...)};
const admin = new Schema({
	username: {
		type: String,
		required: true,
		enum: ['admin']
	},
	password: {
		type: String,
		required: true,
		enum: ['guest']
	}
});

app.route('/login')
	.get((req, res)=> {
		res.render('login.pug')   
	})
	.post((req, res)=> {
		let data = {username: req.body.username, password: req.body.password};
		let errors = admin.validate(data);
		if (errors.length == 0) {
			res.cookie('username', data.username, {maxAge: 18000, httpOnly: true});
			res.render('index.pug');
		}
		else {
			res.redirect('/')
		}
	});

app.get('/logout', (req, res)=> {
	res.clearCookie('username');
	res.render('index.pug');
});

app.get('/me', (req, res)=> {
	if (logged_in) {
		res.json({...});
	} else {
		res.status(400).json(...);
	}
});