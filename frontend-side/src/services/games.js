import axios from 'axios'
const BASE_URL = '/api/games'

const getGames = async () => {
  const randomRating = Math.floor(Math.random() * 22) + 78
  console.log(randomRating)
  const conditions = encodeURIComponent('aggregated_rating <' + `${randomRating}` + ' & summary != null & cover != null')
  const fields = 'aggregated_rating'
  const sort = 'aggregated_rating%20desc'
  const response = await axios.get(BASE_URL + '?conditions=' + conditions + '&fields=' + fields + '&sort=' + sort)
  console.log(response.data)
  return response.data
}

const getGamesBySearch = async (search) => {
  const response = await axios.get(`${BASE_URL}/search/${search}`)
  console.log(response.data)
  return response.data
}

const getCover = async (id) => {
  const response = await axios.get(`${BASE_URL}/cover/${id}`)
  return response.data
}

const getGameById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`)
  // console.log('Game ', response.data)
  return response.data
}

const getGamesFromArray = async (games) => {
  const gamesHandler = games
  let newArray = gamesHandler.map(game => getGameById(game))
  newArray = await Promise.all(newArray)
  console.log('ARray ', newArray)

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
