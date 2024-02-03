// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Route to deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to deliver register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Route to post registration information to db
router.post("/register", utilities.handleErrors(accountController.registerAccount));

module.exports = router;