const stripe = require('stripe')(process.env.STRIPE_KEY)
const connectStripe = async ({ amount, currency }) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: currency || "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent.client_secret
}

module.exports = connectStripe