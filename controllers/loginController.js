/**================================================================ 
            History Of The File 
    Author          - Ranajit Mane 
    purpose         - Writing - Login Related APIs Operation handling
==================================================================== **/
let async = require("async");
let crypto = require('crypto');
let User = require("../model/user.js");
let config = require("../config/config.json");
let error = require("../config/error.json");
let helper = require("../helpers/email.js");

module.exports = {
    getUser: function(req, res) {

        console.log(req.body)

        ///api/customers/:id
        User.findOne({ email: req.body.email , password: req.body.password }, function(err, user) {
            if (err) {
                console.log(err);
                return res.status(400).send({ status: false, message: globalError.DATABASE_PROCESS })
            }
            // delete user['password'];
            return res.status(200).send({ status: true, data: user });
        });
    },
    saveUser : function(req, res) {
        // console.log(req.body)
        var newUser = new User(req.body);
        // var newUser = new User();

        // set the User's
        // newUser.username = req.body.username;
        // newUser.email = req.body.email;
        // newUser.password = req.body.password;
        // newUser.mobile = req.body.mobile;
        // save the User
        newUser.save(function(err) {
            if (err)
            return res.status(400).send({ status: false, message: globalError.DATABASE_PROCESS })
            return req.res.status(200).send({status:true, data: newUser});
        });
    },
    // getUsers: function(req, res) {
    //     let sort = req.query.sort || '-createdAt';
    //     let skip = req.query.skip || 0;
    //     let limit = Number(req.query.limit) || 100;
    //     if (limit > 1000) {
    //         limit = 1000;
    //     }
    //     ///api/customers
    //     User
    //         .find()
    //         .limit(limit) //optional
    //         .skip(skip) //optional
    //         .sort(sort) //optional
    //         .select() //optional
    //         .exec().then(function(err, users) {
    //             return res.json(users);
    //         });
    // },
    // logoutUser: function(req, res) {
    //     req.logout();
    //     res.status(200).send({ status: true, message: "Successful logout." })
    // },
    forgetPass: function(req, res) {
         console.log(req.body)
        async.waterfall([
            function(done) { 
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {
                User.findOne({ email: req.body.email }, function(err, user) {
                    if (!user) {
                        return res.status(500).send({ status: false, message: globalError.USER_NOTEXIST });
                    }

                    console.log(err);
                    console.log(user);

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + config.reset_pass_time;

                    user.save(function(err) {
                        done(err, token, user);
                    });
                });
            },
            function(token, user, done) {
                var option = {
                    to: user.email,
                    subject: config.email.subject,
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/ ' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                }
                helper.sendEmail(option, function(data) {
                    if (data && data.status) {
                        return res.status(200).send({ status: true, message: " Verification Email Sent. " });
                    } else {
                        return res.status(400).send({ status: false, message: data.message });
                    }
                })
            }
        ], function(err) {
            console.log(err);
            // res.redirect('/forgot');
        });
    }
    // tokenValidate: function(req, res) {
    //     User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    //         if (!user)
    //             return res.status(500).send({ status: false, message: globalError.TOKEN_INVALID });
    //         return res.status(200).send({ status: true, message: " Valid User. " });
    //     });
    // },
    // resetPass: function(req, res) {
    //     async.waterfall([
    //         function(done) {
    //             User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    //                 if (!user)
    //                 	return res.status(500).send({ status: false, message: globalError.TOKEN_INVALID });

    //                 let newUser = new User();
    //                 user.password = newUser.generateHash(req.body.password);
    //                 user.resetPasswordToken = undefined;
    //                 user.resetPasswordExpires = undefined;

    //                 console.log("test : ", user);
    //                 user.save(function(err) {
    //                     req.logIn(user, function(err) {
    //                         done(err, user);
    //                     });
    //                 });
    //             });
    //         },
    //         function(user, done) {
    //             var option = {
    //                 to: user.email,
    //                 subject: 'Your password has been changed',
    //                 text: 'Hello,\n\n' +
    //                     'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
    //             }
    //             helper.sendEmail(option, function(data) {
    //                 if (data && data.status) {
    //                     return res.status(200).send({ status: true, message: "password reset." });
    //                 } else {
    //                     return res.status(400).send({ status: false, message: data.message });
    //                 }
    //             })
    //         }
    //     ], function(err) {
    //         res.redirect('/');
    //     });
    // }
}