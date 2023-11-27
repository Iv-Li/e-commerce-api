const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide a name'],
    maxLength: [100, 'Name should not be longer than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxLength: [1000, 'Description should not be longer than 1000 characters']
  },
  image: {
    type: String,
    default: '/uploades/default.jpg'
  },
  colors: {
    type: [String],
    default: ['#222']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['office', 'kitchen','bedroom']
  },
  company: {
    type: String,
    enum: {
      values: ['ikea', 'liddy', 'marcos'],
      message: '{VALUE} is not supported'
    },
    required: [true, 'Company should be provided']
  },
  featured: {
    type: Boolean,
    default: false
  },
  freeShipping: {
    type: Boolean,
    default: false
  },
  inventory: {
    type: Number,
    default: 15
  },
  averageRating: {
    type: Number
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'User should be provided']
  }
}, { timestamps: true })

module.exports = mongoose.model('Product', ProductSchema)
