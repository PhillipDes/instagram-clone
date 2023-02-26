const express = require('express')
const router = express.Router()

//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

//controller functions
const {signup, signin, resetPassword, updatePassword} = require('../controllers/authController')

//sign up route
router.post('/signup', signup)

//sign in route
router.post('/signin', signin)

//reset password route
router.post('/resetpassword', resetPassword)

//update user password after reset email sent
router.post('/updatepassword', updatePassword)

module.exports = router