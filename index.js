require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

const morgan = require('morgan')

const connectDB = require('./app/db/connectDB')
const errorMiddleware = require('./app/middleware/error-handler')
const notFoundMiddleware = require('./app/middleware/not-found')

app.use(morgan('tiny'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('SUCCESS')
})

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
const start = async () => {
  try {
    await connectDB()
    app.listen(PORT)
  } catch (err) {
    console.log({err})
  }
}

start()
