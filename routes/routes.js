/**================================================================ 
            History Of The File 
    Author          - Ranajit Mane 
    Purpose         - Writing - API for the Routes.
==================================================================== **/    
var loginController = require("../controllers/loginController");
var expenseController = require("../controllers/expenseController");

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.send('OK');
    });

    app.post('/login', loginController.getUser);
    app.post('/register', loginController.saveUser);
    app.post('/forgetpass', loginController.forgetPass);
    app.post('/addexpense', expenseController.saveExpense);
    app.get('/listexpense', expenseController.listExpense);
    
};