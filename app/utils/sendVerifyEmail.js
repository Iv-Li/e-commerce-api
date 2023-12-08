const sendMail = require('./sendMail.js')
const sendVerifyEmail = ({ email, verificationToken, origin }) => {
  const verifyLink = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
  const message = `<h1>Please confirm your email clickin on link: <a href={verifyLink}>Confirm email</a></h1>`

  sendMail({
    to: email,
    subject: 'Email varification',
    text: message,
    html: message
  })
}

module.exports = sendVerifyEmail