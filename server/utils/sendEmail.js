const nodemailer = require('nodemailer')
const {EMAIL_HOST, EMAIL_PASS, EMAIL_USER} = require('../config/keys')

const sendEmail = (subject, message, send_to, sender, reply) => {
    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: '587',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const options = {
        from: sender,
        to: send_to,
        replyTo: reply,
        subject: subject,
        html: message
    }

    //send email
    transporter.sendMail(options, function(err, info) {
        if (err) {
            console.log(err)
        } 
    }) 
}

module.exports = {sendEmail}