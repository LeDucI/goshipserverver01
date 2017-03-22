var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var port       = process.env.PORT || 8080;
var database   = require('./config/database');
var User       = require('./app/models/user');
var app        = express();
const router   = express.Router();

var server = require('http').createServer(app);

//Get our request parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static(__dirname + '/public'));

//Logging to console dev
app.use(morgan('dev'));

//Routes
require('./app/routes.js')(router);
app.use('/api/v1', router);

//Run socket 
require('./app/sockets.js').listen(server);

// Sets the connection to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(database.web.url, function (err, database) {
  if (err) {
    console.log(err);
    console.log("Logging Error");
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

	//Listen
	server.listen(port);
	console.log('Listening on port ' + port);
	// demo route (GET http://localhost:8080)
	app.get('/', function(req,res){
		res.send('Hello! The API is at port ' + port);
	});
});



