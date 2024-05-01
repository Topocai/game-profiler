const config = require('./config')
const loggers = require('./loggers')

const axios = require('axios')

const Twitch_Auth = async () => {
    const promise = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${config.TWITCH_CLIENT_ID}&client_secret=${config.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`)
    return promise.data
}

const get_igdb_token = async (req, res, next) => {
    if(!config.IGDB_TOKEN) {
      const data = await Twitch_Auth()
      req.body.igdb_token = data.access_token
    } else {
      req.body.igdb_token = config.IGDB_TOKEN
    }

    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    loggers.error(error.message)

    next()
}

module.exports = {
    get_igdb_token,
    unknownEndpoint,
    errorHandler
}