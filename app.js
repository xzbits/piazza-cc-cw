const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

app.use(bodyParser.json())

const authRoute = require('./routes/auth')
const postRoute = require('./routes/postRoutes')
const interactRoute = require('./routes/interactionRoutes')
const browseTopicsRoute = require('./routes/browseTopicsRoutes')
const browseActiveTopicsRoute = require('./routes/browseActiveTopics')
const browseHistoricalTopicsRoute = require('./routes/browseHistoricalTopics')

app.use('/api/user', authRoute)
app.use('/api/posts', postRoute);
app.use('/api/interactions', interactRoute);

app.use('/api/browse', browseTopicsRoute);
app.use('/api/browse/active', browseActiveTopicsRoute);
app.use('/api/browse/historical', browseHistoricalTopicsRoute);


mongoose.connect(process.env.DB_URL).then(() => {
    console.log('Connected to MongoDB');
})


app.listen(3000, ()=>{
    console.log('Server is running')
})
