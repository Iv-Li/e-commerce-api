const { StatusCodes } = require('http-status-codes')
const CustomError = require('./custom-error')

class Unauthenticated extends CustomError{
  constructor(props) {
    super(props);
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

module.exports = Unauthenticated