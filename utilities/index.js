const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken");
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification options
* ************************************ */

Util.buildClassificationOptions = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let dropdown = '<select name="classification_name" id="classificationList">'
  data.rows.forEach((row) => {
    dropdown += `<option value=${row.classification_id}>${row.classification_name}</option>`
  })
  dropdown += '</select>'
  return dropdown
}


/* **************************************
* Build the inventory detail view HTML
* ************************************ */
Util.buildInventoryDetail = async function (data) {
  let detail
  const vehicle = data[0]
  let price = new Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD', }).format(vehicle.inv_price)
  let mileage = vehicle.inv_miles.toLocaleString('en-US')
  if (data.length > 0) {
    detail = '<div class="vehicleDetail">'
    detail += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}" />`
    detail += '<div class="vehicleDetailInfo">'
    detail += `<h2>Price: ${price}</h2>`
    detail += `<p>${vehicle.inv_description}</p>`
    detail += `<p>Color: ${vehicle.inv_color}</p>`
    detail += `<p>Miles: ${mileage}</p>`
    detail += '</div>'
    detail += '</div>'
  } else {
    detail += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return detail
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
*  Check Login
* ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    console.log("Success")
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util