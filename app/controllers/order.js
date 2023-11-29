const { StatusCodes } = require('http-status-codes')
const Order = require('../models/order')
const Product = require('../models/product')
const { NotFound, BadRequest } = require('../errors')
const { checkPermission } = require('../utils')
const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({ orders, count: orders.length, success: 'success' })
}

const getSingleOrder = async (req, res) => {
  const orderId = req.params.id
  const order = await Order.findById(orderId)

  if(!order) {
    throw new NotFound(`Order with id ${orderId} not found`)
  }

  checkPermission(req.user, { id: order.user })
  res.status(StatusCodes.OK).json({ order, success: 'success' })
}

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id})

  res.status(StatusCodes.OK).json({ orders, count: orders.length, success: 'success' })
}

const createOrder = async (req, res) => {
  const { tax, shippingFee, items: orderItems } = req.body

  if(!tax || !shippingFee) {
    throw new BadRequest('Please provide tax and shipping fee')
  }

  if(!orderItems || orderItems < 1) {
    throw new BadRequest('Please provide item(s) for order')
  }

  let subtotal = 0
  let orders = []

  for (let item of orderItems) {
    const { product: productId, amount } = item

    const product = await Product.findById(productId)

    if(!product) {
      throw new NotFound(`Product with id ${productId} not found`)
    }

    const { name, price, _id, image  } = product
    const checkedItem = { name, price, amount, product: _id, image }

    subtotal += price * amount
    orders = [...orders, checkedItem]
  }

  const total = subtotal + tax + shippingFee

  const order = await Order.create({
    tax,
    shippingFee,
    orderItems,
    subtotal,
    total,
    user: req.user.id
  })

  res.status(StatusCodes.OK).json({ order, success: 'success' })
}

const updateOrder = async (req, res) => {
  const orderId = req.params.id
  const { paymentIntentId } = req.body

  const order = await Order.findById(orderId)
  if (!order) {
    throw new NotFound(`Order with id ${orderId} not found`)
  }
  checkPermission(req.user, { id: orderId})

  order.paymentIntentId = paymentIntentId
  order.status = 'paid'
  await order.save()

  res.status(StatusCodes.OK).json({ order, success: 'success' })
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder
}