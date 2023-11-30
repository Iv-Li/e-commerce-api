const { StatusCodes } = require('http-status-codes')
const { CustomError } = require('../errors')
const errorHandler = (err, req, res, next) => {
  if(err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message, success: 'failed' })
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', success: 'failed' })
}

module.exports = errorHandler