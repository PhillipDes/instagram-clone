//requires
const express = require('express')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 5000
const {MONGO_URI} = require('./config/keys')

const app = express()

//middleware
app.use(express.json())

//models
require('./models/user')
require('./models/post')

//routes
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

//connect to mongodb
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
    console.log('connected to mongodb')
})
mongoose.connection.on('error', (err) => {
    console.log('error connecting', err)
})

if(process.env.NODE_ENV == 'production') {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log("Server is listening on", PORT)
})
