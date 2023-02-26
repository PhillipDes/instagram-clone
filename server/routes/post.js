const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()

//controller require
const {getAllPosts,
        getFollowPosts, 
        getUserPosts, 
        createPost, 
        likePost, 
        unlikePost, 
        postComment,
        deletePost,
        deleteComment} = require('../controllers/postController')

//get all posts to display on the home page
router.get('/getallposts', getAllPosts)

//get posts of users being followed
router.get('/getfollowposts', requireLogin, getFollowPosts) 

//get all posts created by the user
router.get('/getuserposts', requireLogin, getUserPosts)

//user creates a post
router.post('/createpost', requireLogin, createPost)

//like a post
router.put('/like', requireLogin, likePost)

//unlike a post
router.put('/unlike', requireLogin, unlikePost)

//make a comment
router.put('/comment', requireLogin, postComment)

//delete a post
router.delete('/deletepost/:postId', requireLogin, deletePost)

//delete a comment
router.put('/deletecomment/:postId/:commentId', requireLogin, deleteComment)

module.exports = router