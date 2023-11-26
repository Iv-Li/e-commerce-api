const { createJWT, isTokenValid, attachCookiesToRes } = require('./jwt')
const createTokenUser = require('./createTokenUser')
const checkPermission = require('./checkPermission')

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToRes,
  createTokenUser,
  checkPermission
}