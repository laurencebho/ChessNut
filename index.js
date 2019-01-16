const app = require('./app.js');
const http = require('http').Server(app);
const port = 5000;

http.listen(process.env.PORT || port, (err) => {
	if (err) return console.log(err);
	return console.log('Listening on port ' + port);
});
