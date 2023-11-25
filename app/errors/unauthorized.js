const { StatusCodes } = require('http-status-codes')
const CustomError = require('./custom-error')

class Unauthorized extends CustomError{
  constructor(props) {
    super(props);
    this.statusCode = StatusCodes.FORBIDDEN
  }
}

module.exports = Unauthorized