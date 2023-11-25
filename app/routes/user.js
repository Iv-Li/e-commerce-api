const express = require('express')
const router = express.Router()

const {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  updateUserPassword
} = require('../controllers/user')

router.route('/').get(getAllUsers).patch(updateUser)
router.route('/showMe').get(getCurrentUser)
router.route('/updatePassword').get(getCurrentUser).patch(updateUserPassword)
router.route('/:id').get(getSingleUser)

module.exports = router