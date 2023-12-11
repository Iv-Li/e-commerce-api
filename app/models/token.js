const mongoose = require('mongoose')

const Token = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  },
  ip: {
    type: String
  },
  agentType: {
    type: String
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Token', Token)