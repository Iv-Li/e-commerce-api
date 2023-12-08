const { createJWT, isTokenValid, attachCookiesToRes } = require('./jwt')
const createTokenUser = require('./createTokenUser')
const checkPermission = require('./checkPermission')
const sendVerifyEmail = require('./sendVerifyEmail')

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToRes,
  createTokenUser,
  checkPermission,
  sendVerifyEmail
}