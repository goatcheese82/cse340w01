const revModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

createReview = async function (req, res) {
   const { account_id, inv_id, review_text } = req.body
   const data = await invModel.getInventoryByInventoryId(inv_id)
   const detail = await utilities.buildInventoryDetail(data)
   const vehicle = data[0]
   let reviews = await revModel.getReviewsByInventory(vehicle.inv_id)
   let screenname = `${res.locals.accountData.account_firstname.charAt(0)}${res.locals.accountData.account_lastname}`
   console.log(res.locals.accountData)
   let nav = await utilities.getNav()
   const invName = res.locals.loggedin ? `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}` : null

   const revResult = await revModel.addReview(
      review_text, inv_id, account_id
   )

   if (revResult) {
      req.flash(
         "notice",
         "Yay! Thank you for the review!"
      )
      res.status(201).redirect("back")
   } else {
      req.flash("error", "Sorry, something went wrong.")
      res.status(501).redirect("back")
   }
}

updateReview = async function (req, res) {
   const { review_text, review_id } = req.body

   const revResult = await revModel.updateReview(
      review_text, review_id
   )

   if (revResult) {
      req.flash(
         "notice",
         "Yay! The review was updated!"
      )
      res.status(201).redirect("back")
   } else {
      req.flash("error", "Sorry, something went wrong.")
      res.status(501).redirect("back")
   }
}

deleteReview = async function (req, res) {
   const review_id = req.params.revId
}

buildReviewUpdate = async function (req, res, next) {
   const review_id = req.params.reviewId
   const data = await revModel.getReviewById(review_id)
   let review = data[0]
   let nav = await utilities.getNav()
   console.log(review)
   res.render("./inventory/updateReview", {
      title: "Update Review",
      nav,
      review,
      errors: null
   })
}

module.exports = { createReview, updateReview, buildReviewUpdate }