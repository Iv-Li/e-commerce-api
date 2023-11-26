const express = require('express')
const router = express.Router()
const { authorizedPermission } = require('../middleware/authentication')

const {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  updateUserPassword
} = require('../controllers/user')

router.route('/').get(authorizedPermission('admin', 'user'), getAllUsers)
router.route('/showMe').get(getCurrentUser)
router.route('/updatePassword').patch(updateUserPassword)
router.route('/update').patch(updateUser)
router.route('/:id').get(getSingleUser)

module.exports = router