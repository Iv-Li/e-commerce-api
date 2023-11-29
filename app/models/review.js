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

ReviewSchema.statics.calculateAverageAmount = async function (productId) {
  const result = await this.aggregate([
    { $match: {
      product: productId
    }},
    { $group: {
      _id: null,
      averageRating: { $avg: '$rating' },
      numOfReviews: { $sum: 1 }
    }}
  ])

  await this.model('Product').findByIdAndUpdate(productId, {
    averageRating: Math.ceil(result[0]?.averageRating) || 0,
    numOfReviews: result[0]?.numOfReviews || 0
  })
}

ReviewSchema.post('save', async function() {
  this.constructor.calculateAverageAmount(this.product)
})

ReviewSchema.post('deleteOne', async function() {
  this.constructor.calculateAverageAmount(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)