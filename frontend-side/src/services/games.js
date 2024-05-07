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

export default {
  getGames,
  getCover,
  getGamesBySearch
}
