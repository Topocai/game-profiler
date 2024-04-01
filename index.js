require('dotenv').config();
const axios = require('axios');
const express = require('express')

const mongoose = require('mongoose')
const morgan = require('morgan')

const Twitch_Auth = () => {
    const promise = axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`)
    return promise.then((response) => response.data)
}

const igbdbRequests = require('./igdb/requests.js');

let bearer_access_token;

function setBearerToken() {
  Twitch_Auth()
  .then((data) => {
      bearer_access_token = data.access_token
  })
}

setBearerToken()

const app = express()
app.use(express.json())

morgan.token('reqBody', (req) => JSON.stringify(req.body))
morgan.token('url', (req) => req.url.indexOf('?') > 0 ? req.url.substring(0, req.url.indexOf('?')) : req.url)
morgan.token('query', (req) => JSON.stringify(req.query))

app.use(morgan(' :method :url ( :status ) :res[content-length] - :response-time ms - :reqBody :query'))

/////////////////////////////////////////////////////IGDB API ROUTES////////////////////////////////////////////////////////

const check_bearer = (req, res, next) => {
  console.log("Here", bearer_access_token)
  if(!bearer_access_token) {
    setBearerToken()
    return res.status(401).json({error: 'Missing bearer token, try again in a few minutes'})
  }
  next()
}

app.get('/api/games', check_bearer, (req, res) => {
  console.log('GET games | query:', req.query)
  const fields = req.query.fields ? req.query.fields : null
  const limit = req.query.limit ? Number(req.query.limit) : 10
    
  igbdbRequests.Get_Games(bearer_access_token, { queryFields: fields, limit: limit })
  .then((queryResult) => res.send(queryResult))
  .catch((error) => res.status(error.satusCode || 500).json({error: error.message}))
})

app.get('/api/game/:id', check_bearer, (req, res) => {
  const id = req.params.id

  const fields = req.query.fields ? req.query.fields : null

  igbdbRequests.Get_GameById(bearer_access_token, id, { queryFields: fields })
  .then((queryResult) => res.send(queryResult))
  .catch((error) => res.status(error.satusCode || 500).json({error: error.message}))
})

app.get('/api/games/search/:name', check_bearer, (req, res) => {
  const name = req.params.name

  igbdbRequests.Get_GameByName(bearer_access_token, name)
  .then((queryResult) => res.send(queryResult))
  .catch((error) => res.status(error.satusCode || 500).json({error: error.message}))
})

////////////////////////////////////////////////////////////USER API ROUTES////////////////////////////////////////////////////////

const url = process.env.MONGODB_URI_TEST

mongoose.set('strictQuery', false)

mongoose.connect(url)
.then(() => console.log('[MONGOOSE] Connected to MongoDB'))
.catch(err => console.error('[MONGOOSE] Error in conection', err))

const UserModel = require('./models/User.js')

app.post('/api/user', (req, res) => {
  const body = req.body;

  if(body.dbpassword != process.env.MONGODB_PASSWORD)
    return res.status(401).json({error: 'Wrong password'})

  if(!body.username || !body.password || !body.displayName || !body.email) {
    return res.status(400).json({error: 'Missing required fields'})
  }
  
  UserModel.find({})
  .then((users) => {
    if(users.find(user => user.username === body.username || user.email === body.email)) {
      return res.status(409).json({error: 'Username or email already exists'})
    }

    const newUserData = new UserModel({
      username: body.username,
      password: body.password,
      displayName: body.displayName,
      email: body.email,
      UserData: {
        user_genre: null,
        user_platform: [],
        birthday: null,
        created_at: Date.now(),
        games: {
          played: [],
          finished: [],
          playing: [],
          on_hold: [],
          abandoned: [],
          wishlist: [],
          favorites: []
        }
      }
    })

    newUserData.save()
    .then((savedUser) => res.json(savedUser))
    .catch((error) => res.status(400).json({error: error.message}))
  })
})

app.listen(process.env.PORT)


/*
const user = {
  username: 'topocai',
  password: 'password',
  displayName: 'Topocai',
  email: 'top@example.com',
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