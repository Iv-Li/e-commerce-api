const { StatusCodes } = require('http-status-codes')
const Product = require('../models/product')
const { BadRequest } = require('../errors')
const createProduct = async (req, res) => {
  req.body.userId = req.user.id
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({ products, count: products.length})
}

const getSingleProduct = async (req, res) => {
  const prodId = req.params.id
  const product = await Product.findById(prodId).populate('reviews')

  if(!product) {
    throw new BadRequest(`Product with id ${prodId} not found`)
  }
  res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
  res.status(StatusCodes.OK).json({ product })
}

const updateImgProduct = (req, res) => {
  res.send('updateImgProduct')
}

const deleteProduct = async (req, res) => {
  const prodId = req.params.id
  const product = await Product.findByIdAndDelete(prodId)

  if(!product) {
    throw new BadRequest(`Product with id ${prodId} not found`)
  }
  res.status(StatusCodes.OK).json({ success: 'success' })
}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  updateImgProduct,
  deleteProduct
}