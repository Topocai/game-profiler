import axios from 'axios'
const BASE_URL = '/api/user'

const getUser = async (id) => {
  const response = await axios.get(BASE_URL + '/' + id)

  return response.data
}

export default {
  getUser
}
