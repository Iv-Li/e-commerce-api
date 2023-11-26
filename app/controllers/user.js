const { StatusCodes } = require('http-status-codes')
const User = require('../models/user')
const { NotFound, BadRequest } = require('../errors')
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

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password -__v')

  if (!user) {
    throw new NotFound('User not found')
  }

  res.status(StatusCodes.OK).json({ user, success: "success" })
}

const updateUser = async (req, res) => {
  const { name, email } = req.body
  const updatedFields = {}

  if(name) {
    updatedFields.name = name
  }
  if(email) {
    updatedFields.email = email
  }
  const user = await User.findOneAndUpdate({_id: req.user.id}, updatedFields, { new: true, runValidators: true }).select('-password -__v')

  if (!user) {
    throw new NotFound('User not found')
  }

  res.status(StatusCodes.OK).json({ user, success: "success" })
}

const updateUserPassword = async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    throw new NotFound('User not found')
  }

  const { oldPassword, newPassword } = req.body
  if(!oldPassword || !newPassword) {
    throw new BadRequest('Please provide both value')
  }

  const isOldPasswordMatch = user.comparePassword(oldPassword)
  if(!isOldPasswordMatch) {
    throw new BadRequest('Initial password is not correct')
  }

  user.password = newPassword
  user.save()

  res.status(StatusCodes.OK).json({ message: 'Password updated', success: "success" })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  updateUserPassword
}