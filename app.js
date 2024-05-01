const express = require('express')

const mongoose = require('mongoose')
const cors = require('cors')
require('express-async-errors')

const app = express()

const config = require('./utils/config')
const middlewares = require('./utils/middlewares')

app.use(cors())
app.use(express.json())

const url = config.mongoURI

mongoose.set('strictQuery', false)

mongoose.connect(url)
.then(() => console.log('[MONGOOSE] Connected to MongoDB'))
.catch(err => console.error('[MONGOOSE] Error in conection', err))

const gamesRouter = require('./controllers/games')

app.use('/api/games', middlewares.get_igdb_token, gamesRouter)

app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)

module.exports = app