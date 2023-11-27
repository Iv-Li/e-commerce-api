require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

const connectDB = require('../app/db/connectDB')
const Product = require('../app/models/product')
const products = require('./products.json')

const PORT = 3001

const start = async () => {
  try {
    await connectDB()
    app.listen(PORT)
    await Product.deleteMany()
    await Product.create(products)
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

start()
