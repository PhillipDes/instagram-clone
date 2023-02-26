const mongoose = require('mongoose')
const Post = mongoose.model('Post')

//get all posts to display on the home page
const getAllPosts = (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate('comments.postedBy', '_id name')
        .sort('-createdAt')
        .then(posts => {
            res.json({posts})
        })
        .catch(error => {
            console.log(error)
        })
}
const getFollowPosts = (req, res) => {
    Post.find({postedBy: {$in:req.user.following}})
        .populate("postedBy", "_id name")
        .populate('comments.postedBy', '_id name')
        .sort('-createdAt')
        .then(posts => {
            res.json({posts})
        })
        .catch(error => {
            console.log(error)
        })
}

//get all posts created by the user
const getUserPosts = (req, res) => {
    Post.find({postedBy: req.user._id})
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .then(userPosts => {
            res.json({userPosts})
        })
        .catch(error => {
            console.log(error)
        })
}

//create user post
const createPost = (req, res) => {
    const {title, body, photo} = req.body

    if(!title || !body || !photo) {
        return res.status(422).json({error: "Fill out all fields"})
    }

    req.user.password = undefined

    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user
    })

    post.save()
        .then(result => {
            res.json({post: result})
        })
        .catch(error => {
            console.log(error)
        })
}

const likePost = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.user._id}
    }, {new: true})
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name')
    .exec((error, result) => {
        if(error) {
            return res.status(422).json({error})
        } else {
            return res.json(result)
        }
    })
}

const unlikePost = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id}
    }, {new: true})
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name')
    .exec((error, result) => {
        if(error) {
            return res.status(422).json({error})
        } else {
            return res.json(result)
        }
    })
}

const postComment = (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments: comment}
    }, {new: true})
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((error, result) => {
        if(error) {
            return res.status(422).json({error})
        } else {
            return res.json(result)
        }
    })
}

const deletePost = (req, res) => {
    Post.findOne({_id: req.params.postId})
    .populate('postedBy', '_id')
    .exec((error, post) => {
        if(error || !post) {
            return res.status(422).json({error})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(result => {
                res.json(result)
            }).catch(error => {
                console.log(error)
            })
        }
    }) 
}

const deleteComment = (req, res) => {
    Post.findByIdAndUpdate(req.params.postId, {
        $pull: {comments: {_id:req.params.commentId}}
    }, {new: true})
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((error, result) => {
        if(error) {
            return res.status(422).json({error})
        }
        else {
            return res.json(result)
        }
    })
}

module.exports = {
        getAllPosts, 
        getFollowPosts,
        getUserPosts, 
        createPost, 
        likePost, 
        unlikePost, 
        postComment, 
        deletePost, 
        deleteComment
}