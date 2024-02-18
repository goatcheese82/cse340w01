const pool = require("../database")

/* ***************************
 *  Get: all reviews
 * ************************** */

async function getAllReviews() {
   return await pool.query("SELECT * FROM public.review")
}


/* ***************************
 *  Get: review by id
 * ************************** */
async function getReviewById(review_id) {
   try {
      const data = await pool.query(
         `SELECT * FROM public.review WHERE review_id = $1`,
         [review_id]
      )
      return data.rows
   } catch (error) {
      console.error("getReviews error" + error)
   }
}


/* ***************************
 *  Get: reviews by inv_id
 * ************************** */

async function getReviewsByInventory(inv_id) {
   try {
      const data = await pool.query(
         `SELECT * FROM public.review AS r
         JOIN public.account AS a
         ON r.account_id = a.account_id
         WHERE r.inv_id = $1`,
         [inv_id]
      )
      return data.rows
   } catch (error) {
      console.error("Error fetching Reviews by Inventory" + error)
   }
}

/* ***************************
 *  Get: reviews by account_id
 * ************************** */

async function getReviewsByAccount(account_id) {
   try {
      const data = await pool.query(
         `SELECT * FROM public.review AS r
         JOIN public.inventory AS i
         ON r.inv_id = i.inv_id
         WHERE r.account_id = $1`,
         [account_id]
      )
      return data.rows
   } catch (error) {
      console.error("Error fetching Reviews by Inventory" + error)
   }
}

/* ***************************
 *  Post: Create new review
 * ************************** */

async function addReview(review_text, inv_id, account_id) {
   try {
      const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
      return await pool.query(sql, [review_text, inv_id, account_id])
   } catch (error) {
      return error.message
   }
}

/* ***************************
 *  Post: Update review
 * ************************** */

async function addReview(review_text, inv_id, account_id) {
   try {
      const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
      return await pool.query(sql, [review_text, inv_id, account_id])
   } catch (error) {
      return error.message
   }
}

module.exports = { getAllReviews, getReviewsByInventory, getReviewsByAccount, addReview, getReviewById };