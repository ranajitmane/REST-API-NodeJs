/**================================================================ 
            History Of The File 
    Author          - Ranajit Mane 
    purpose         - Writing - Define the schema for our expenses model
==================================================================== **/
// load the things we need
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our expenses model
var expenseSchema = mongoose.Schema({
    expenseName: {
        type: String,
        required: true
    },
    expenseDescr: {
        type: String,
        required: true
    },
    expenseAmount: {
        type: [Number],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// methods ======================


// create the model for expenses and expose it to our app
module.exports = mongoose.model('expenses', expenseSchema);
