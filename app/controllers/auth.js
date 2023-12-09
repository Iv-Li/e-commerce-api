const { StatusCodes } = require('http-status-codes')
const User = require('../models/user')
const { BadRequest, Unauthenticated } = require('../errors')
const {
  attachCookiesToRes,
  createTokenUser,
  sendVerifyEmail
} = require('../utils')

const register = async (req, res) => {
  const { email } = req.body
  const isEmailExisted = await User.findOne({email})
  if (isEmailExisted) {
    throw new BadRequest(`Duplicate value: ${email} already exists`)
  }
  const verificationToken ='fake token'
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
  attachCookiesToRes({ res, tokenPayload })
  res.status(StatusCodes.CREATED).json({ user: rest, success: 'success'})
}

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body
  const user = await User.findOne({email})

  if (!user || (user.verificationToken !== verificationToken)) {
    throw new Unauthenticated(`Verification failed`)
  }
  const { __v, password, ...rest} = user.toObject()
  const tokenPayload = createTokenUser(rest)
  attachCookiesToRes({ res, tokenPayload })
  res.status(StatusCodes.CREATED).json({ user: rest, success: 'success'})
}

const logout = (req, res) => {
  res.cookie('token', '', { expiresIn: new Date(Date.now())})
  res.status(StatusCodes.OK).json({ success: 'success'})
}

module.exports = {
  register,
  login,
  verifyEmail,
  logout
}

