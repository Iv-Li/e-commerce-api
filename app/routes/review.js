const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/authentication')

const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/review')

router.route('/')
  .get(getAllReviews)
  .post(authenticate, createReview)

router.route('/:id')
  .get(getSingleReview)
  .patch(authenticate, updateReview)
  .delete(authenticate, deleteReview)

module.exports = router