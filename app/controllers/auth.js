const { StatusCodes } = require('http-status-codes')
const User = require('../models/user')
const { BadRequest, Unauthenticated } = require('../errors')
const { attachCookiesToRes, createTokenUser } = require('../utils')

const register = async (req, res) => {
  const { email } = req.body
  const isEmailExisted = await User.findOne({email})
  if (isEmailExisted) {
    throw new BadRequest(`Duplicate value: ${email} already exists`)
  }
  const user = await User.create(req.body)
  const { __v, password, ...rest} = user.toObject()

  const tokenPayload = createTokenUser(rest)
  console.log({tokenPayload})
  attachCookiesToRes({ res, tokenPayload })
  res.status(StatusCodes.CREATED).json({ user: rest, success: 'success'})
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

const logout = (req, res) => {
  res.cookie('token', '', { expiresIn: new Date(Date.now())})
  res.status(StatusCodes.OK).json({ success: 'success'})
}

module.exports = {
  register,
  login,
  logout
}

