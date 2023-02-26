const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()

const {getUser, followUser, unfollowUser, updatePicture, searchUsers} = require('../controllers/userController')

//get another users profile info
router.get('/getuser/:id', getUser)

//follow a user
router.put('/follow', requireLogin, followUser)

//unfollow a user
router.put('/unfollow', requireLogin, unfollowUser)

//update a user profile picture
router.put('/updatepicture', requireLogin, updatePicture)

//search for other users
router.post('/searchusers', searchUsers)


module.exports = router