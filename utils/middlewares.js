const config = require('./config')
const loggers = require('./loggers')

const axios = require('axios')
const jwt = require('jsonwebtoken')

const TwitchAuth = async () => {
  const promise = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${config.TWITCH_CLIENT_ID}&client_secret=${config.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`)
  return promise.data
}

const getIgdbToken = async (req, res, next) => {
  if (!config.IGDB_TOKEN) {
    const data = await TwitchAuth()
    req.body.igdb_token = data.access_token
  } else {
    req.body.igdb_token = config.IGDB_TOKEN
  }

  next()
}

const requestLogger = (req, res, next) => {
  let logText = `${req.method} ${req.path}`
  const reqBody = { ...req.body }
  if (reqBody.password) {
    reqBody.password = '******'
  }

  logText += Object.keys(reqBody).length > 0 ? ` - [REQ BODY BELOW]\n${JSON.stringify(reqBody)}` : ''
  loggers.info(logText, '--------')

  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  loggers.error(error.message)

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.message.includes('E11000 duplicate key error')) {
    return res.status(409).json({ error: `Expected unique value for ${Object.keys(error.keyValue)[0]}` })
  }

  next()
}

const tokenVerify = (req, res, next) => {
  const authorization = req.get('authorization')
  const token = authorization && authorization.toLowerCase().startsWith('bearer ') ? authorization.substring(7) : null

  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return res.status(401).send({ error: 'invalid token sd' }).end() // or redirect to login
    } else {
      req.body.userLogin = { id: decodedToken.id, username: decodedToken.username }
    }
  } else {
    return res.status(401).send({ error: 'invalid authorization, make sure you type "bearer <token>" ;)' }).end()
  }

  next()
}

module.exports = {
  getIgdbToken,
  unknownEndpoint,
  TwitchAuth,
  errorHandler,
  requestLogger,
  tokenVerify
}
