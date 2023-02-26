const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: 'https://res.cloudinary.com/djp/image/upload/v1677163318/no-pfp_odqnvo.png'
    },
    followers: [{
        type: ObjectId,
        ref: 'User'
    }],
    following: [{
        type: ObjectId,
        ref: 'User'
    }],
    resetToken: {
        type: String
    },
    expireToken: {
        type: Date
    }
})

mongoose.model('User', userSchema)