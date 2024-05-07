const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const User = require('../models/User')
const UserDataModel = require('../models/UserData')
const UserGameDataModel = require('../models/UserGameData')

const helper = require('./helper')

const app = require('../app')

const api = supertest(app)

const { TwitchAuth } = require('../utils/middlewares')
const getTwitchToken = async () => {
  const data = await TwitchAuth()
  return data.access_token
}

const igdbServices = require('../igdb/requests')
/*
describe('New igdb post function', () => {
  test('works', async () => {
    const token = await getTwitchToken()
    const data = await igdbServices.BaseRequest(token, 'games', { fields: 'name,id,url,first_release_date,summary,genres' })
    assert(data.length > 0)
  })

  test('gets the parent game in a search', async () => {
    const token = await getTwitchToken()
    const data = await igdbServices.BaseRequest(token, 'games', { search: 'Genshin Impact' })
    assert.strictEqual(data[0].id, 119277)
  })
}) */

describe('One user with data and game defined', () => {
  beforeEach(async () => {
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

  test('asd', async () => {
    assert.strictEqual(1, 1)
  })
})
