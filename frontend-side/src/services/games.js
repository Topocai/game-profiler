import axios from 'axios'
const BASE_URL = '/api/games'

const getGames = async (limit = 5) => {
  const randomRating = Math.floor(Math.random() * 22) + 78
  console.log('R RNG', randomRating)
  const conditions = encodeURIComponent('aggregated_rating <' + `${randomRating}` + ' & summary != null & cover != null')
  const fields = 'aggregated_rating'
  const sort = 'aggregated_rating%20desc'
  const response = await axios.get(BASE_URL + '?conditions=' + conditions + '&fields=' + fields + '&sort=' + sort + '&limit=' + Number(limit))
  return response.data
}

const getGamesBySearch = async (search, conditions = null) => {
  const response = await axios.get(`${BASE_URL}/search/${search}?${conditions ? 'conditions=' + conditions : ''}`)
  return response.data
}

const getCover = async (id) => {
  const response = await axios.get(`${BASE_URL}/cover/${id}`)
  if (response.data.toLowerCase() !== 'no cover found') {
    const proxyUrl = `${BASE_URL}/proxy/cover?imageUrl=${encodeURIComponent(response.data)}`
    return proxyUrl
  }
  return response.data
}

const getGameById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`)
    return response.data
  } catch {
    return null
  }
}

const getGamesFromArray = async (games) => {
  const gamesHandler = games
  let newArray = gamesHandler.map(game => getGameById(game))
  newArray = await Promise.all(newArray)

  return newArray
}

const getCoversFromArray = async (games) => {
  const newGamesArray = games
  let covers = newGamesArray.map(game => getCover(game.id))
  covers = await Promise.all(covers)

  newGamesArray.forEach((game, index) => {
    game.cover = covers[index]
    newGamesArray[index] = game
  })

  return newGamesArray
}

export default {
  getGames,
  getCover,
  getGameById,
  getGamesBySearch,
  getCoversFromArray,
  getGamesFromArray
}
