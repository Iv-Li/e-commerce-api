const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please provide a name'],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    unique: true,
    require: [true, 'Please provide an email'],
    validate: {
      validator: validator.isEmail,
      message: ({ value }) => `${value} is not a valid email`
    }
  },
  password: {
    type: String,
    require: [true, 'Please provide a password'],
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: '{VALUE} is not supported'
    },
    default: 'user'
  },
})

module.exports = mongoose.model('User', UserSchema)