const sendMail = require('./sendMail')
const sendResetEmail = ({ email, token, origin }) => {
  const resetLink = `${origin}/user/reset-password?token=${token}&email=${email}`
  const message = `<h1>Please reset your password by clicking on link: <a href="${resetLink}">Reset password</a></h1>`

  sendMail({
    to: email,
    subject: 'Reset Password Email',
    text: message,
    html: message
  })
}

module.exports = sendResetEmail