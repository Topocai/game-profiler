import axios from 'axios'
const BASE_URL = '/api/login'

const loginUser = async (username, password) => {
  const response = await axios.post(BASE_URL, { username, password })
  return response.data
}

export default { loginUser }
