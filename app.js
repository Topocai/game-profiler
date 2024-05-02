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
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')

app.use(middlewares.requestLogger)

app.use('/api/games', middlewares.getIgdbToken, gamesRouter)
app.use('/api/login', loginRouter)
app.use('/api/user', userRouter)

app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)

module.exports = app
