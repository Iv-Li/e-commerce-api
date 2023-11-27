const { StatusCodes } = require('http-status-codes')
const Review = require('../models/review')
const Product = require('../models/product')
const { NotFound, BadRequest } = require('../errors')
const { checkPermission } = require('../utils')

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length, success: 'success'})
}

const getSingleReview = async (req, res) => {
  const reviewId = req.params.id
  const review = await Review.findById(reviewId).populate({ path: 'product', select: 'name price description'})

  if(!review) {
    throw new NotFound(`Review with if ${reviewId} not found`)
  }

  res.status(StatusCodes.OK).json({ review, success: 'success'})
}

const createReview = async (req, res) => {
  const { product: productId } = req.body
  const isProductExist = await Product.findById(productId)
  if (!isProductExist) {
    throw new BadRequest(`Product with id ${productId}  does not exist`)
  }
  const existedReview = await Review.findOne({
    user: req.user.id,
    product: productId
  })
  if(existedReview) {
    throw new BadRequest('User have already made review for this product')
  }
  req.body.user = req.user.id
  const review = await Review.create(req.body)

  res.status(StatusCodes.OK).json({ review, success: 'success'})
}

const updateReview = async (req, res) => {
  const { title, comment, rating } = req.body
  const reviewId = req.params.id
  const review = await Review.findById(reviewId)

  if(!review) {
    throw new NotFound(`Review with id ${reviewId} not found`)
  }

  checkPermission(req.user, { id: review.user})

  if (title) review.title = title
  if (comment) review.comment = comment
  if (rating) review.rating = rating

  review.save()
  res.status(StatusCodes.OK).json({ review, success: 'success'})
}

const deleteReview = async (req, res) => {
  const reviewId = req.params.id
  const existedReview = await Review.findById(reviewId)
  if(!existedReview) {
    throw new NotFound(`Review with id ${reviewId} does not exist`)
  }

  checkPermission(req.user, { id: existedReview.user})

  await existedReview.deleteOne()
  res.status(StatusCodes.OK).json({ success: 'success'})
}

module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview
}