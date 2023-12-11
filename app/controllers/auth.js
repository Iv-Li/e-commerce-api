const { StatusCodes } = require('http-status-codes')
const User = require('../models/user')
const { BadRequest, Unauthenticated } = require('../errors')
const {
  attachCookiesToRes,
  createTokenUser,
  sendVerifyEmail,
  sendResetEmail
} = require('../utils')
const Token = require("../models/token");
const crypto = require('crypto')

const register = async (req, res) => {
  const { email } = req.body
  const isEmailExisted = await User.findOne({email})
  if (isEmailExisted) {
    throw new BadRequest(`Duplicate value: ${email} already exists`)
  }
  const verificationToken = crypto.randomBytes(64).toString('hex')
  await User.create({ ...req.body, verificationToken })
  sendVerifyEmail({ email, verificationToken, origin:  process.env.CLIENT_ORIGIN  })

  res.status(StatusCodes.OK).json({ success: 'success', message: 'Check email to verify the account' })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequest('Please provide email and password')
  }

  const user = await User.findOne({ email })

  if(!user) {
    throw new Unauthenticated('No credential')
  }

  const isPasswordMatch = await user.comparePassword(password)
  if(!isPasswordMatch) {
    throw new Unauthenticated('Password not valid')
  }

  const { __v, password: pass, ...rest} = user.toObject()
  const tokenPayload = createTokenUser(rest)

  let refreshToken = ''
  const existedRefreshToken = await Token.findOne({
    user: tokenPayload.user.id
  })

  if (existedRefreshToken) {
    const { isValid } = existedRefreshToken
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }


    refreshToken = existedRefreshToken

    attachCookiesToRes({ res, user: tokenPayload, refreshToken })
    res.status(StatusCodes.CREATED).json({ user: rest, success: 'success'})

    return
  }

  refreshToken = crypto.randomBytes(70).toString('hex')
  const userAgent = req.headers['user-agent']
  const ip = req.ip
  const userToken = { ip, userAgent, user: user._id }

  await Token.create(userToken)

  attachCookiesToRes({ res, user: tokenPayload, refreshToken })
  res.status(StatusCodes.CREATED).json({ user: rest, success: 'success'})
}

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body
  const user = await User.findOne({email})

  if (!user || (user.verificationToken !== verificationToken)) {
    throw new Unauthenticated(`Verification failed`)
  }
  user.isVerified = true
  user.verificationToken = ''
  await user.save()
  const { __v, password, ...rest} = user.toObject()
  const tokenPayload = createTokenUser(rest)
  attachCookiesToRes({ res, user: tokenPayload, refreshToken: res.refreshToken })
  res.status(StatusCodes.CREATED).json({ user: rest, success: 'success'})
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    throw Unauthenticated(`User with email ${email} not found`)
  }

  const passwordToken = crypto.randomBytes(70).toString('hex')
  const expires = 1000 * 60 * 60 * 24 //1d

  user.passwordToken = passwordToken
  user.passwordTokenExpirationDate = new Date(Date.now() + expires)
  await user.save()

  sendResetEmail({ email, token: passwordToken, origin: process.env.CLIENT_ORIGIN})
  res.status(StatusCodes.OK).json({ success: "success", message: 'Check email fot reset link'})
}

const resetPassword = async (req, res) => {
  const { email, token, password } = req.body

  if (!email) {
    throw new BadRequest(`Please provide valid email`)
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw Unauthenticated(`Credentials failed`)
  }

  const isTokenVerified = user.passwordToken === token
  const isTokenExpired = !user.passwordTokenExpirationDate || new Date() > user.passwordTokenExpirationDate

  if (!isTokenVerified || isTokenExpired) {
    throw new Unauthenticated(`Token not valid`)
  }

  user.password = password
  user.passwordToken = ''
  await user.save()

  const { __v, password: pass, ...rest} = user.toObject()

  res.status(StatusCodes.OK).json({ success: "success", user: rest })
}
const logout = (req, res) => {
  res.cookie('token', '', { expiresIn: new Date(Date.now())})
  res.status(StatusCodes.OK).json({ success: 'success'})
}

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout
}

