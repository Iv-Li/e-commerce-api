require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xssClean = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')

const connectDB = require('./app/db/connectDB')
const errorMiddleware = require('./app/middleware/error-handler')
const notFoundMiddleware = require('./app/middleware/not-found')
const { authenticate } = require('./app/middleware/authentication')

const authRouter = require('./app/routes/auth')
const userRouter = require('./app/routes/user')
const productRouter = require('./app/routes/product')
const reviewRouter = require('./app/routes/review')
const orderRouter = require('./app/routes/order')

app.set('trust proxy', 1);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60
}))
app.use(helmet())
app.use(xssClean())
app.use(cors())
app.use(mongoSanitize())

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', authenticate, userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', authenticate, orderRouter)

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
