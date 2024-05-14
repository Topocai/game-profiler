const { test, describe } = require('node:test')
const assert = require('node:assert')

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
