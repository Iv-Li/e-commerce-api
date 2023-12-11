const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LONG})
}

const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

const attachCookiesToRes = ({ res, user, refreshToken }) => {
  const accessToken = createJWT({payload: { user }})
  const tokenRefresh = createJWT({payload: { user, refreshToken }})

  const oneDay = 1000 * 60 * 60 * 24
  const refreshExpiration = 1000 * 60 * 60 * 24 * 30

  res.cookie('accessToken', accessToken, {
    expiresIn: new Date(Date.now() + oneDay),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: process.env.COOKIE_SECRET
  })

  res.cookie('refreshToken', tokenRefresh, {
    expiresIn: new Date(Date.now() + refreshExpiration),
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