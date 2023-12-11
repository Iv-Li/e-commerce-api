const { createJWT, isTokenValid, attachCookiesToRes } = require('./jwt')
const createTokenUser = require('./createTokenUser')
const checkPermission = require('./checkPermission')
const sendVerifyEmail = require('./sendVerifyEmail')
const sendResetEmail = require('./sendResetEmail')

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToRes,
  createTokenUser,
  checkPermission,
  sendVerifyEmail,
  sendResetEmail
}