const invModel = require("../models/inventory-model")
const revModel = require("../models/review-model")
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
  const vehicle = data[0]
  let reviews = await revModel.getReviewsByInventory(vehicle.inv_id)
  let screenname = res.locals.loggedin ? `${res.locals.accountData.account_firstname.charAt(0)}${res.locals.accountData.account_lastname}` : null
  let nav = await utilities.getNav()
  const invName =`${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/inventory", {
    title: invName,
    nav,
    detail,
    vehicle,
    reviews,
    screenname,
    errors: null
  })
}

/* *************************
 * View: Inventory Management
   *************************/
invCont.getManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationOptions()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    classificationSelect,
    nav,
    errors: null
  })
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* *************************
 * View: Add Classification
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
 * View: Add Inventory
   *************************/
invCont.addInventory = async function (req, res, next) {
  let classifications = await invModel.getClassifications()
  let nav = await utilities.getNav()
  let classOptions = await utilities.buildClassificationOptions()
  res.render("./inventory/addInventory", {
    title: "Add New Vehicle",
    nav,
    classifications,
    classOptions,
    errors: null
  })
}

/* *************************
 * Action: Add Inventory
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


/* *************************
 * Get: Update Inventory
   *************************/
invCont.updateInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  let Data = await invModel.getInventoryByInventoryId(inventory_id)
  let itemData = Data[0]
  let classOptions = await utilities.buildClassificationOptions()
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/updateInventory", {
    title: `Update ${itemName}`,
    nav,
    classOptions,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


/* *************************
 * Post: Add Classification
   *************************/
invCont.createClassification = async function (req, res, next) {
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
    res.status(201).render("inventory/addClassification", {
      title: "Add New Classification",
      nav
    })
  } else {
    req.flash("error", "Sorry, your classification was not created.")
    res.status(501).render("inventory/addClassification", {
      title: "Add New Classification",
      nav
    })
  }
}


module.exports = invCont