/**================================================================ 
            History Of The File 
    Author          - Ranajit Mane 
    purpose         - Writing - Define the schema for our user model
==================================================================== **/
// load the things we need
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    firstName: {
        type: String
        // required: true
    },
    lastName: {
        type: String
        // required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    accessLevel: {
        type: String,
        // required: true,
        enum:["admin", "executive", "project_manager", "template_admin"]
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpires : {
        type : Date
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('users', userSchema);
