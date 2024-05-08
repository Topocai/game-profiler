import axios from 'axios'
const BASE_URL = '/api/games'

const getGames = async () => {
  const response = await axios.get(BASE_URL)

  return response.data
}

const getGamesBySearch = async (search) => {
  const response = await axios.get(`${BASE_URL}/search/${search}`)
  return response.data
}

const getCover = async (id) => {
  const response = await axios.get(`${BASE_URL}/cover/${id}`)
  return response.data
}

const getGameById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`)
  console.log('Game ', response.data)
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
