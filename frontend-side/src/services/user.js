import axios from 'axios'
const BASE_URL = '/api/user'

const getUser = async (id) => {
  const response = await axios.get(BASE_URL + '/' + id)

  return response.data
}

const postOrEditGameData = async (gameData, { userData, tokenExpiresCallback }) => {
  try {
    const response = await axios.post(`${BASE_URL}/${userData.id}/game`, gameData,
      {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      }
    )
    return response.data
  } catch (err) {
    if (err.response.status === 409) {
      const response = await axios.put(`${BASE_URL}/${userData.id}/game`, gameData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`
          }
        }
      )
      return response.data
    } else if (err.response.status === 401 && err.response.data.error === 'invalid token') {
      tokenExpiresCallback()
    }
  }
}

export default {
  getUser,
  postOrEditGameData
}
