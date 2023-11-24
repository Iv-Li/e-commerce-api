const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { BadRequest } = require('../errors')
const { createJWT } = require('../utils')

const register = async (req, res) => {
  const { email } = req.body
  const isEmailExisted = await User.findOne({email})
  if (isEmailExisted) {
    throw new BadRequest(`Duplicate value: ${email} already exists`)
  }
  const user = await User.create(req.body)
  const { __v, password, ...rest} = user.toObject()

  const tokenPayload = { name: rest.name, role: rest.role, id: rest.id }
  const token = createJWT({ payload: tokenPayload })
  res.status(StatusCodes.CREATED).json({ user: rest, success: 'success', token})
}

const login = (req, res) => {
  res.send('login')
}

const logout = (req, res) => {
  res.send('logout')
}

module.exports = {
  register,
  login,
  logout
}

