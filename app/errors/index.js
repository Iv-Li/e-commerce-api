const CustomError = require('./custom-error')
const BadRequest = require('./bad-request')
const Unauthenticated = require('./unauthenticated')
const NotFound = require('./not-found')
const Unauthorized = require('./unauthorized')

module.exports = {
  CustomError,
  BadRequest,
  Unauthenticated,
  NotFound,
  Unauthorized
}