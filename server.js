var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	path = require("path"),
	busboy = require('connect-busboy');

mongoose.Promise = global.Promise;
var config = require('./_config');

mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {

	if (err) {
		console.log('Error connecting to the database. ' + err);
	} else {
		console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
	}
});


app.listen(port);
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'www')));
app.use(bodyParser.urlencoded({
	extended: true
}));


//use busboy to get to req.files field 
//when doing POST of Content-type:multipart/form-data
app.use(busboy());

require('./app/routes/user')(app);
require('./app/routes/post')(app);


module.exports = app;