const { test, describe, after, before } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const User = require('../models/User')
const UserDataModel = require('../models/UserData')
const UserGameDataModel = require('../models/UserGameData')

const helper = require('./helper')

const app = require('../app')
const api = supertest(app)

let userAuth = null

const { default: mongoose } = require('mongoose')

describe('One user with data and game defined', () => {
  before(async () => {
    await User.deleteMany({})
    await UserDataModel.deleteMany({})
    await UserGameDataModel.deleteMany({})

    const user = new User(helper.dummyUser)
    const gameUserData = new UserGameDataModel({ ...helper.dummyGameUserData, user_id: user._id })
    const userData = new UserDataModel({ ...helper.dummyUserData, user_id: user._id, userGamesData: [gameUserData] })

    const passwordHash = await bcrypt.hash(helper.dummyUser.password, 10)
    user.password = passwordHash
    user.UserData = userData.id
    await user.save()
    await gameUserData.save()
    await userData.save()
  })

  test('Get user by id', async () => {
    const user = await User.findOne({ username: helper.dummyUser.username })
    await api.get(`/api/user/${user._id}`).expect(200)
  })

  describe('As User logged', () => {
    before(async () => {
      const response = await api.post('/api/login').send({ password: helper.dummyUser.password, username: helper.dummyUser.username }).expect(200)
      userAuth = response.body
    })

    test('Put user data', async () => {
      const response = await api.put(`/api/user/${userAuth.id}/profile`)
        .set('Authorization', `Bearer ${userAuth.token}`)
        .send({ userData: { ...helper.dummyUserData, user_name: 'Topacai', gamesList: { ...helper.dummyUserData.gamesList, finished: [] } } })
      assert.strictEqual(response._body.user_name, 'Topacai')
      assert.strictEqual(response._body.gamesList.finished.length, 0)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
