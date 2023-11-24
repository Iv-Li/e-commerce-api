const { StatusCodes } = require('http-status-codes')
const notFound = (req, res) => {
  return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Not Found', success: 'failed' })
}

module.exports = notFound