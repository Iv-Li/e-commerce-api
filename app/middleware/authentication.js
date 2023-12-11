const { Unauthenticated } = require('../errors')
const { isTokenValid, createTokenUser } = require('../utils')
const { Unauthorized } = require('../errors')
const Token = require('../models/token')
const User = require('../models/user')
const { attachCookiesToRes } = require('../utils')
const authenticate = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies

  try {

    if(accessToken) {
      const { name, role, id } = isTokenValid(accessToken)
      req.user = { name, role, id }

      next()
    }

    const tokenPayload = isTokenValid(refreshToken)

    const existedToken = await Token.findOne({
      user: tokenPayload.user.id,
      refreshToken: tokenPayload.refreshToken
    })

    if(!existedToken || !existedToken?.isValid) {
      throw new Unauthenticated('Authentication invalid')
    }

    attachCookiesToRes({
      res,
      user: tokenPayload.user,
      refreshToken: existedToken.refreshToken
    })

    req.user = tokenPayload.user
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