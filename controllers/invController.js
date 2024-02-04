const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null
  })
}

/* ***************************
 *  Build inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const detail = await utilities.buildInventoryDetail(data)
  let nav = await utilities.getNav()
  const invName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/inventory", {
    title: invName,
    nav,
    detail,
    errors: null
  })
}

/* *************************
 * Display Management View
   *************************/
invCont.getManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null
  })
}


/* *************************
 * Display Add Classification View
   *************************/
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/addClassification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}


/* *************************
 * Display Add Vehicle View
   *************************/
invCont.addVehicle = async function (req, res, next) {
  const classifications = await invModel.getClassifications()
  let nav = await utilities.getNav()
  res.render("./inventory/addVehicle", {
    title: "Add New Vehicle",
    nav,
    classifications,
    errors: null
  })
}


/* *************************
 * Add Classification
   *************************/
invCont.createVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const createResult = await invModel.addClassification(
    classification_name
  )

  if (createResult) {
    req.flash(
      "notice",
      `${classification_name} is now a classification.`
    )
    res.status(201).render("inv/addClassification", {
      title: "Add New Classification",
      nav
    })
  } else {
    req.flash("error", "Sorry, your classification was not created.")
    res.status(501).render("inv/addClassification", {
      title: "Add New Classification",
      nav
    })
  }
}


module.exports = invCont