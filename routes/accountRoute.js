// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');


// Default Route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.getIndex));
// Route to deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Execute Login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);
// Route to deliver register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Route to post registration information to db
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount));

// Process the login attempt
router.post(
   "/login",
   regValidate.loginRules(),
   regValidate.checkLoginData,
   utilities.handleErrors(accountController.accountLogin))

module.exports = router;