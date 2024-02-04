// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");
const { handleErrors } = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", handleErrors(invController.buildByInventoryId));

// Route to management page
router.get("/", handleErrors(invController.getManagement));

// Route to Add new Classification
router.get("/addClassification", handleErrors(invController.addClassification));

// Route to Create new Classification
router.post("/addClassification", handleErrors(invController.createClassification));

// Route to Add new vehicle Form
router.get("/addVehicle", handleErrors(invController.addVehicle));

// Route to Create new vehicle
router.post("/addVehicle", handleErrors(invController.createVehicle));


module.exports = router;