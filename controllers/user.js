const userRouter = require('express').Router()
const User = require('../models/User')
const UserDataModel = require('../models/UserData')
const UserGameDataModel = require('../models/UserGameData')

const { UserData, UserGameData } = require('../utils/UserData')

const bcrypt = require('bcrypt')

const middlewares = require('../utils/middlewares')

const getUserDataModel = async (id, res) => {
  const userData = await UserDataModel.findOne({ user_id: id })
  if (!userData) {
    const userDataTemplate = new UserData(id)
    const userData = new UserDataModel(userDataTemplate)
    await userData.save()
    return res.status(304).json({ message: 'User data created, try again' })
  }
  return userData
}

const getUserModel = async (id, res) => {
  const user = await User.findById(id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  return user
}

userRouter.post('/', async (req, res) => {
  const newUserData = { ...req.body }

  // newUserData contains Password, username, displayName and email
  if (newUserData.password == null || newUserData.username == null || newUserData.display_name == null || newUserData.email == null) {
    return res.status(400).json({ error: 'Missing required fields (password, username, display_name or email)' })
  }

  // Create hash of password
  const passwordHash = await bcrypt.hash(newUserData.password, 10)

  // create user mongooseObject
  // Check if username is unique

  const userDataTemplate = new UserData(null, newUserData.display_name)

  const userData = new UserDataModel(userDataTemplate)

  const user = new User({
    username: newUserData.username,
    password: passwordHash,
    email: newUserData.email,

    UserData: userData.id
  })

  userData.user_id = user.id

  // Save and response
  await userData.save()
  const newUser = await user.save()
  return res.status(201).json(newUser)
})

userRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  const user = await User.findById(id).populate({
    path: 'UserData',
    populate: {
      path: 'userGamesData',
      model: 'UserGameData',
      select: '-user_id'
    }
  })
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  return res.status(200).json(user)
})

userRouter.use(middlewares.tokenVerify)

// Modify user values (email) // Not in use
userRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const body = req.body

  if (body.userLogin.id !== id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (body.email == null) {
    return res.status(400).json({ error: 'Missing user or email' })
  }

  const user = await getUserModel(id, res)

  await user.updateOne({
    email: body.email || user.email
  })
  return res.status(200).json(await User.findById(id).populate('UserData'))
})

// Add a game to a list of user data
userRouter.post('/lists/:id', async (req, res) => {
  const id = req.params.id
  const body = req.body

  if (body.userLogin.id !== id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (body.gameId == null) {
    return res.status(400).json({ error: 'Missing gameId' })
  }

  if (body.listToAdd == null) {
    return res.status(400).json({ error: 'Missing listToAdd' })
  }

  const userData = await getUserDataModel(id, res)

  if (userData.gamesList[body.listToAdd] != null) {
    userData.gamesList[body.listToAdd].push(body.gameId)
    await userData.updateOne({
      gamesList: userData.gamesList
    })

    return res.status(200).json(userData)
  } else {
    return res.status(400).json({ error: 'Invalid list name' })
  }
})

// Add a gameData of a user
userRouter.post('/:id/game', async (req, res) => {
  const id = req.params.id
  const body = req.body

  if (body.userLogin.id !== id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (body.gameId == null) {
    return res.status(400).json({ error: 'Missing gameId' })
  }

  const userData = await getUserDataModel(id, res)

  const existingData = await UserGameDataModel.findOne({ user_id: id, game_id: body.gameId })
  if (existingData) {
    return res.status(409).json({ error: 'Game already in list' })
  }

  const gameDataTemplate = new UserGameData(body.gameId)
  Object.keys(gameDataTemplate).forEach(key => {
    if (body[key] != null) {
      gameDataTemplate[key] = body[key]
    }
  })

  gameDataTemplate.user_id = id

  const newGameData = new UserGameDataModel(gameDataTemplate)
  await userData.updateOne({
    userGamesData: [...userData.userGamesData, newGameData.id]
  })

  const gameData = await newGameData.save()
  res.status(201).json(gameData)
})

// Modify game Data of a user
userRouter.put('/:id/game/', async (req, res) => {
  const id = req.params.id
  const body = req.body

  if (body.userLogin.id !== id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (body.gameId == null) {
    return res.status(400).json({ error: 'Missing gameId' })
  }

  const gameData = await UserGameDataModel.findOne({ user_id: id, game_id: body.gameId })

  if (gameData == null) {
    return res.status(404).json({ error: 'Game data not found' })
  }

  const gameDataTemplate = { ...gameData._doc }
  Object.keys(gameDataTemplate).forEach(key => {
    if (body[key] != null) {
      gameDataTemplate[key] = body[key]
    }
  })

  const newGameData = await UserGameDataModel.findByIdAndUpdate(gameData.id, gameDataTemplate, { new: true })
  return res.status(200).json(newGameData)
})

// Delete game Data of a user
userRouter.delete('/:id/game', async (req, res) => {
  const id = req.params.id
  const body = req.body

  if (body.userLogin.id !== id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (body.gameId == null) {
    return res.status(400).json({ error: 'Missing gameId' })
  }

  // Search the game Data doc
  const userGameData = await UserGameDataModel.findOne({ user_id: id, game_id: body.gameId })
  if (!userGameData) {
    return res.status(404).json({ error: 'Game data not found' })
  }

  // Search the userData doc for removed gameData from the list
  const userData = await UserDataModel.findOne({ user_id: id })
  await userData.updateOne({
    userGamesData: userData.userGamesData.filter(id => id.toString() !== userGameData.id.toString())
  })

  // Delete the gameData doc
  await UserGameDataModel.deleteOne({ _id: userGameData.id })
  return res.status(204).end()
})

module.exports = userRouter
