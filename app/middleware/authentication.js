const { Unauthenticated } = require('../errors')
const { isTokenValid } = require('../utils')
const { Unauthorized } = require('../errors')

const authenticate = (req, res, next) => {
  const {token} = req.signedCookies

  if (!token) {
    throw new Unauthenticated('Token not provided')
  }

  try {
    const { name, role, id } = isTokenValid({ token })
    req.user = { name, role, id }
    console.log({user: isTokenValid({ token })})
    next()
  } catch (err) {
    throw new Unauthenticated('Authentication invalid')
  }



}

const authorizedPermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Unauthorized('Access forbidden')
    }
    next()
  }
}
module.exports = {
  authenticate,
  authorizedPermission
}