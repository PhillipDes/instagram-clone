const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const { sendEmail } = require('../utils/sendEmail')

const {JWT_SECRET, EMAIL_USER} = require('../config/keys')

//signup user
const signup = (req, res) => {
    const {name, email, password, picture} = req.body
    
    //check for empty field(s)
    if(!name || !email || !password) {
        return res.status(422).json({error: "Complete all fields"})
    }

    User.findOne({email: email})
        .then((savedUser) => {
            //check if given email is already in use
            if(savedUser) {
                return res.status(422).json({error: 'Email already in use'})
            }

            //hash password for security
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedpassword,
                        picture
                    })

                    //save user to db
                    newUser.save()
                        .then(user => {
                            try {
                                const send_to = user.email
                                const sender = EMAIL_USER
                                const reply = user.email
                                const subject = 'Sign up successful'
                                const message = `<h1>Welcome</h1>`

                                sendEmail(subject, message, send_to, sender, reply)
                            } catch (error) {
                                console.log(error)
                            }
                            const token = jwt.sign({_id: user._id}, JWT_SECRET)
                            const {_id, name, email, picture, followers, following} = newUser
                            res.json({token, user: {_id, name, email, picture, followers, following}})
                        })
                        .catch(error => {
                            console.log(error)
                        })
                })
    })
    .catch(error => {
        console.log(error)
    })
}

//sign in function
const signin = (req, res) => {
    const {email, password} = req.body

    //check for missing field(s)
    if(!email || !password) {
        return res.status(422).json({error: "Fill in all fields"})
    }

    User.findOne({email:email})
        .then(savedUser => {

            //check if user exists
            if(!savedUser) {
                return res.status(422).json({error:"Invalid Email or password"})
            }

            //check if password is correct
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if(doMatch) {
                        const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                        const {_id, name, email, picture, followers, following} = savedUser
                        res.json({token, user: {_id, name, email, picture, followers, following}})
                    }
                    else {
                        return res.status(422).json({error:"Invalid Email or password"})
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        })
}

const resetPassword = (req, res) => {
    crypto.randomBytes(32, (error, buffer) => {
        if(error) {
            console.log(error)
        } else{
            const token = buffer.toString('hex')
            User.findOne({email: req.body.email})
                .then(user => {
                    if(!user) {
                        return res.status(422).json({error: "User doesn't exist with that email"})
                    }
                    user.resetToken = token
                    user.expireToken = Date.now() + 3600000
                    
                    user.save().then((result) => {
                        try {
                            const send_to = user.email
                            const sender = EMAIL_USER
                            const reply = user.email
                            const subject = 'Reset Password'
                            const message = `
                                <p>You have requested to reset your password</p>
                                <h5><a href="http://localhost:3000/reset/${token}">Click here to reset your password</a></h5>
                                `

                            sendEmail(subject, message, send_to, sender, reply)
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    res.json({message:"Check email for password reset"})
                })
        }
    })
}

const updatePassword = (req, res) => {
    const newPassword = req.body.password
    const token = req.body.token

    User.findOne({resetToken: token, expireToken: {$gt: Date.now()}})
        .then(user => {
            if(!user) {
                return res.status(422).json({error: "Try again. Session expired"})
            }
            bcrypt.hash(newPassword, 12)
                .then(hashedpassword => {
                    user.password = hashedpassword
                    user.resetToken = undefined
                    user.expireToken = undefined
                    
                    user.save().then((savedUser) => {
                        res.json({message: 'Password updated'})
                    })
                })
        })
}

module.exports = {signin, signup, resetPassword, updatePassword}