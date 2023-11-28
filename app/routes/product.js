const express = require('express')
const router = express.Router()
const { authenticate, authorizedPermission } = require('../middleware/authentication')

const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  updateImgProduct,
  deleteProduct
} = require('../controllers/product')

const { getSingleProductReview } = require('../controllers/review')

router.route('/')
  .get(getAllProducts)
  .post([authenticate, authorizedPermission('admin')], createProduct)

router.route('/updateImg')
  .patch([authenticate, authorizedPermission('admin')], updateImgProduct)

router.route('/:id')
  .get(getSingleProduct)
  .patch([authenticate, authorizedPermission('admin')], updateProduct)
  .delete([authenticate, authorizedPermission('admin')], deleteProduct)

router.route('/:id/reviews')
  .get(getSingleProductReview)

module.exports = router