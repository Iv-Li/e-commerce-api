const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

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
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verified: Date
})


UserSchema.pre('save', async function() {
  if(!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function(comparedPassword) {
  const isMatch = await bcrypt.compare(comparedPassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)