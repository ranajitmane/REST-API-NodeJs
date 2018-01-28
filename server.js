/**================================================================ 
            History Of The File 
    Author          - Ranajit Mane 
    purpose         - Writing - Entry point of server file
==================================================================== **/
let express  = require('express');
const app      = express();
let mongoose = require('mongoose');
// let passport = require('passport');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let session      = require('express-session');

global.globalError = require("./config/error.json");
global.__parentDir = __dirname;

const configDB = require('./config/database.js');
const config = require('./config/config.json');

const port     = process.env.PORT || config.PORT;
const hostIp     = config.HOST_IP || "0.0.0.0";

configDB.connectMongoDB(); // connect to our database

// require('./config/passport'); // pass passport for configuration

// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//static public folder
app.use(express.static('public'))

//Set CORS header and intercept "OPTIONS" preflight call from AngularJS
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === "OPTIONS") 
        res.sendStatus(200);
    else 
        next();
}

app.use(allowCrossDomain);

// required for passport
// app.use(session(
// 	{ 
// 		secret: '',
// 	    resave: true,
// 	    saveUninitialized: true
// 	}
// )); // session secret

// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions

// routes
require('./routes/routes')(app); // load our routes and pass in our app and fully configured passport

// launch
app.listen(port, hostIp);
console.log('The magic happens on port ' + port);