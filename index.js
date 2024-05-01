const app = require('./app.js');
const config = require('./utils/config.js');

app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`))  

////////////////////////////////////////////////////////////USER API ROUTES////////////////////////////////////////////////////////

/*
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
        gamesList: {
          finished: [],
          playing: [],
          abandoned: [],
          on_hold: [],
          wishlist: [],
          favorites: []
        },
        userGamesData: []
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

    const body = req.body
    const genre = genders[body.user_genre] ? genders[body.user_genre] : null

    let platform = body.user_platform ? body.user_platform.map(platform => plataforms[platform]) : null
    platform = platform && platform.length > 0 ? platform : null

    let birthday = body.birthday ? body.birthday : null

    const gamesLists = body.gamesLists ? body.gamesLists : null

    const gamesData = body.gamesData ? body.gamesData : null

    const newUserData = {
      user_genre: genre,
      user_platform: platform,
      birthday: birthday,
      gamesList: gamesLists,
      userGamesData: gamesData
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
}))*/

