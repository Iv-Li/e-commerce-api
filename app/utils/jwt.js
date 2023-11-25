const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LONG})
}

const isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

const attachCookiesToRes = ({ res, tokenPayload }) => {
  const token = createJWT({payload: tokenPayload})

  const oneDay = 1000 * 60 * 60 * 24
  res.cookie('token', token, {
    expiresIn: new Date(Date.now() + oneDay),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: process.env.COOKIE_SECRET
  })
}

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToRes
}