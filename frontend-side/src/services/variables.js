import axios from 'axios'
const BASE_URL = '/api/variables'

const platforms = async () => {
  const response = await axios.get(BASE_URL + '/platforms')
  return response.data
}

const genres = async () => {
  const response = await axios.get(BASE_URL + '/genders')
  return response.data
}

const gameLists = async () => {
  const response = await axios.get(BASE_URL + '/gameStates')
  return response.data
}

export default {
  platforms,
  genres,
  gameLists
}
