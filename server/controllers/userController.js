const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const User = mongoose.model("User")

const getUser = (req, res) => {
    User.findOne({_id: req.params.id})
        .select("-password")
        .then(user => {
            Post.find({postedBy: req.params.id})
                .populate('postedBy', '_id name')
                .exec((error, posts) => {
                    if(error) {
                        return res.status(422).json({error})
                    }
                    res.json({user, posts})
                })
        }).catch(error => {
            return res.status(404).json({error})
        })
}

const followUser = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: {followers: req.user._id}
    }, {new: true}, 
        (error, result) => {
            if(error) {
                return res.status(422).json({error})
            }
            User.findByIdAndUpdate(req.user._id, {
                $push: {following: req.body.followId}
            }, {new: true})
                .select("-password")
                .then(result => res.json(result))
                .catch(error => {
                    return res.status(422).json({error})
                })
            })
    }

const unfollowUser = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $pull: {followers: req.user._id}
    }, {new: true}, 
        (error, result) => {
            if(error) {
                return res.status(422).json({error})
            }
            User.findByIdAndUpdate(req.user._id, {
                $pull: {following: req.body.followId}
            }, {new: true})
                .select("-password")
                .then(result => res.json(result))
                .catch(error => {
                    return res.status(422).json({error})
                })
            }) 
    }

const updatePicture = (req, res) => {
    User.findByIdAndUpdate(req.user._id,  {$set: {picture: req.body.picture}}, {new:true},
        (error, result) => {
            if(error) {
                return res.status(422).json({error: "Picture can't be updated"})
            }
            res.json(result)
        })
}

const searchUsers = (req, res) => {
    let userPattern = new RegExp('^' + req.body.query)

    User.find({name: {$regex: userPattern}})
        .select('_id email name')
        .then(user => {
            res.json({user})
        }).catch(error => {
            console.log(error)
        })
}

module.exports = {getUser, followUser, unfollowUser, updatePicture, searchUsers}