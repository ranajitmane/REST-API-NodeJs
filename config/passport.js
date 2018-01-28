/**================================================================ 
            History Of The File 
    Author          - Ranajit Mane 
    Purpose         - Writing - passport session setup & LOCAL SIGNUP
==================================================================== **/

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');

// load up the user model
var User = require('../app/models/user');


// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            User.findOne({ 'email': email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return req.res.status(400).send({ status:false, message: JSON.stringify(err)});

                // check to see if theres already a user with that email
                if (user) {
                    return req.res.status(500).send({ status:false, message: globalError.ALREADY_EXIST});;
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.email = email;
                    newUser.firstName = req.body.firstName;
                    newUser.lastName = req.body.lastName;
                    newUser.title = req.body.title;
                    newUser.accessLevel = req.body.accessLevel;

                    newUser.company = {_id : req.body.company };
                    newUser.department = {_id : req.body.department};
                    
                    newUser.date_Modified = Date.now();
                    newUser.password = newUser.generateHash(password);

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return req.res.status(200).send({status:true, data: newUser});
                    });
                }
            });
        });
    }
));

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form
    User.findOne({ 'email': email }, function(err, user) {
        if (err)
            return req.res.status(400).send({ status:false, message: JSON.stringify(err)});

        if (!user)
            return req.res.status(500).send({ status:false, message: globalError.USER_NOTEXIST});

        if (!user.validPassword(password))
            return req.res.status(500).send({ status:false, message: globalError.WRONG_PSW});
        return done(null, user);
    });
}));


// exports.isLoginAuthanticated = passport.authenticate('local-login', { session : true });
// exports.isSignupAuthanticated = passport.authenticate('local-signup', { session : true });