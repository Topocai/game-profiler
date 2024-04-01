require('dotenv').config();
const axios = require('axios');
const express = require('express')

const Twitch_Auth = () => {
    const promise = axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`)
    return promise.then((response) => response.data)
}

const igbdbRequests = require('./igdb/requests.js');

/**
 * Get 
 * IGDB id
 * name = name
 * image = cover = id 
 * Description = summary
 * Launch day = first_release_date = unix timestamp
 * IGDB Url = url
 */

Twitch_Auth()
.then(async (authData) => {
    console.log(authData)

    const bearer_access_token = authData.access_token

    const app = express()
    app.use(express.json())

    const morgan = require('morgan')

    morgan.token('reqBody', (req) => JSON.stringify(req.body))
    morgan.token('url', (req) => req.url.indexOf('?') > 0 ? req.url.substring(0, req.url.indexOf('?')) : req.url)
    morgan.token('query', (req) => JSON.stringify(req.query))

    app.use(morgan(' :method :url ( :status ) :res[content-length] - :response-time ms - :reqBody :query'))

    app.get('/api/games', (req, res) => {
      console.log('GET games | query:', req.query)

      const fields = req.query.fields ? req.query.fields : null
      const limit = req.query.limit ? Number(req.query.limit) : 10
        
      igbdbRequests.Get_Games(bearer_access_token, { queryFields: fields, limit: limit })
      .then((queryResult) => res.send(queryResult))
      .catch((error) => res.status(error.satusCode || 500).json({error: error.message}))
    })

    app.get('/api/game/:id', (req, res) => {
      const id = req.params.id

      const fields = req.query.fields ? req.query.fields : null

      igbdbRequests.Get_GameById(bearer_access_token, id, { queryFields: fields })
      .then((queryResult) => res.send(queryResult))
      .catch((error) => res.status(error.satusCode || 500).json({error: error.message}))
    })

    app.get('/api/games/search/:name', (req, res) => {
      const name = req.params.name

      igbdbRequests.Get_GameByName(bearer_access_token, name)
      .then((queryResult) => res.send(queryResult))
      .catch((error) => res.status(error.satusCode || 500).json({error: error.message}))
    })

    app.listen(process.env.PORT)

})
/*
const user = {
  username: 'topocai',
  password: 'password',
  displayName: 'Topocai',
  email: 'Jn6Qd@example.com',
  id: '12345'
}

const userData = {
  id: user.id,
  user_genre: '',
  user_platform: '',
  birthday: Date,
  created_at: Date,
  games: {
    played: [],
    finished: [],
    playing: [],
    on_hold: [],
    abandoned: [],
    wishlist: [],
    favorites: []
  }
}*/