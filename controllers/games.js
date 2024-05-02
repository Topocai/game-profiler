const gamesRouter = require('express').Router()
const igbdbRequests = require('../igdb/requests.js')

gamesRouter.get('/cover/:id', async (req, res) => {
  const id = req.params.id

  const data = await igbdbRequests.GetCover(req.body.igdb_token, id, { cover_size: 'screenshot_huge' })

  res.send(data)

  // .catch((error) => res.status(error.satusCode || 500).json({error: error.message}))
})

gamesRouter.get('/', async (req, res) => {
  console.log('GET games | query:', req.query)

  console.log(req.body.igdb_token)

  const fields = req.query.fields ? req.query.fields : null
  const limit = req.query.limit ? Number(req.query.limit) : 10

  const data = await igbdbRequests.GetGames(req.body.igdb_token, { queryFields: fields, limit })
  res.send(data)
  // .catch((error) => res.status(error.satusCode || 500).json({error: error.message}))
})

gamesRouter.get('/:id', async (req, res) => {
  const id = req.params.id

  const fields = req.query.fields ? req.query.fields : null

  const data = await igbdbRequests.GetGameById(req.body.igdb_token, id, { queryFields: fields })
  res.send(data)
  // .catch((error) => res.status(error.satusCode || 500).json({error: error.message}))
})

gamesRouter.get('/search/:name', async (req, res) => {
  const name = req.params.name

  const data = await igbdbRequests.GetGameByName(req.body.igdb_token, name)
  res.send(data)
  // .catch((error) => res.status(error.satusCode || 500).json({error: error.message}))
})

module.exports = gamesRouter
