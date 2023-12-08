const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodemailerConfig')

const sendMail = ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);
  transporter.sendMail({
    from: "iva147iva147@gmail.com",
    to,
    subject,
    text,
    html
  })

}

module.exports = sendMail
