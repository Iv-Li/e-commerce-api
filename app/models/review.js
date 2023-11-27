const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxLength: 100
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true,' Please provide a rating']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxLength: 1000
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user']
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Please provide a product']
  }
}, { timestamps: true })

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

module.exports = mongoose.model('Review', ReviewSchema)