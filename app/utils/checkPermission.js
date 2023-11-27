const { Unauthorized } = require('../errors')

const checkPermission = (requestedUser, responseUser) => {
  if (requestedUser.role === 'admin') return
  if(requestedUser.id === responseUser.id.toString()) return
  throw new Unauthorized('Not authorised for this route')
}

module.exports = checkPermission