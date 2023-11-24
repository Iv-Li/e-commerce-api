const { StatusCodes } = require('http-status-codes')
const User = require('../models/user')
const { BadRequest } = require('../errors')
const register = async (req, res) => {
  const { email } = req.body
  const isEmailExisted = await User.findOne({email})
  if (isEmailExisted) {
    throw new BadRequest(`Duplicate value: ${email} already exists`)
  }
  const user = await User.create(req.body)
  res.status(StatusCodes.CREATED).json({ user, success: 'success'})
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

