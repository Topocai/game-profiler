require('dotenv').config();
const axios = require('axios');
const express = require('express')

const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

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
app.use(cors())
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

app.get('/api/games/cover/:id', check_bearer, (req, res) => {
  const id = req.params.id
  igbdbRequests.Get_Cover(bearer_access_token, id, { cover_size: 'screenshot_huge' })
  .then((queryResult) => res.send(queryResult))
  .catch((error) => res.status(error.satusCode || 500).json({error: error.message}))
})

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

const UserModel = require('./models/User.js');
const User = require('./models/User.js');

app.get('/api/profile/genders', (req, res) => {
  const { genders } = require('./variables.js')
  
  res.json(Object.entries(genders).map(([key, value]) => {
    const newObject = {}
    newObject[key] = value
    return newObject
  }))
})

app.get('/api/profile/plataforms', (req, res) => {
  const { plataforms } = require('./variables.js')
  
  res.json(Object.entries(plataforms).map(([key, value]) => {
    const newObject = {}
    newObject[key] = value
    return newObject
  }))
})

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
          finished: [],
          playing: [],
          abandoned: [],
          on_hold: [],
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

const check_new_user_data = (fn) => {

  return function (req, res, next) {
    const { genders, plataforms } = require('./variables.js')

    console.log(req.body)

    const body = req.body
    const genre = genders[body.user_genre] ? genders[body.user_genre] : null

    let platform = body.user_platform ? body.user_platform.map(platform => plataforms[platform]) : null
    platform = platform && platform.length > 0 ? platform : null

    let birthday = body.birthday ? body.birthday : null

    const games = body.games ? body.games : null

    const newUserData = {
      user_genre: genre,
      user_platform: platform,
      birthday: birthday,
      games: games
    }

    req.body.newUserData = newUserData

    fn(req, res, next)
  }
}

app.put('/api/user/:id', check_new_user_data(async function(req, res) {
  const id = req.params.id
  const body = req.body

  const newUserData = body.newUserData

  UserModel.findById(id).then(user => {
    if(!user) {
      return res.status(404).json({error: 'User not found'})
    }

    Object.keys(newUserData).forEach(key => {
      const value = newUserData[key]
      if(value != null) {
        console.log(`The key ${key} has a change of ${value}`)
        if(key == 'games') {
          Object.keys(user.UserData.games).forEach(category => {
            if(newUserData.games[category] != null) {
              const gamesSaved = user.UserData.games[category]
              const gamesToSave = newUserData.games[category].filter(game => !gamesSaved.includes(game))
              newUserData.games[category] = gamesToSave.concat(gamesSaved)
              console.log("The category", category, "has a change of", newUserData.games[category])
            } else {
              newUserData.games[category] = []
            }
          })
        }
      } else {
        newUserData[key] = user[key]
      }
    })
    console.log("Finished new data", newUserData)
    user.UserData = newUserData
    UserModel.findByIdAndUpdate(id, {...user}, { strict: true, new: true })
    .then((savedUser) => res.json(savedUser))
    .catch((error) => res.status(400).json({error: error.message}))
  })
}))

app.listen(process.env.PORT)