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

// Create Classification
/*view*/router.get("/addClassification", handleErrors(invController.addClassification));
/*action*/router.post("/addClassification", handleErrors(invController.createClassification));

// Route:View: Create Inventory
router.get("/addInventory", handleErrors(invController.addInventory));
router.get("/updateInventory/:inventoryId", handleErrors(invController.updateInventory));

// Route: Create Inventory
router.post("/addInventory", handleErrors(invController.createVehicle));

// Delete Inventory

router.get("/deleteInventory/:inventoryId", handleErrors(invController.deleteInventoryView));
router.post("/deleteInventory/:inventoryId", handleErrors(invController.deleteInventory));


module.exports = router;