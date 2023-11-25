const { StatusCodes } = require('http-status-codes')
const User = require('../models/user')
const { NotFound } = require('../errors')
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user'}).select('-password -__v')
  res.status(StatusCodes.OK).json({ users, success: "success" })
}

const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -__v')

  if (!user) {
    throw new NotFound('User not found')
  }

  res.status(StatusCodes.OK).json({ user, success: "success" })
}

const getCurrentUser = (req, res) => {
  res.send('getCurrentUser')
}

const updateUser = (req, res) => {
  res.send('updateUser')
}

const updateUserPassword = (req, res) => {
  res.send('updateUserPassword')
}

module.exports = {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  updateUserPassword
}