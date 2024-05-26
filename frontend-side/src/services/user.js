import axios from 'axios'
const BASE_URL = '/api/user'

const getUser = async (id) => {
  try {
    const response = await axios.get(BASE_URL + '/' + id)
    return response.data
  } catch {
    return null
  }
}

const getUserDataByUsername = async (username) => {
  console.log('getting', username)
  try {
    const response = await axios.get(BASE_URL + '/?username=' + username)
    return response.data
  } catch (err) {
    console.error('a')
    return null
  }
}

const putUserData = async (newUserData, { userData, tokenExpiresCallback }) => {
  try {
    const response = await axios.put(`${BASE_URL}/${userData.id}/profile`, { userData: newUserData },
      {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      }
    )

    if (response.status === 200) {
      return response.data
    }
  } catch (err) {
    if (err.response.status === 401 && err.response.data.error === 'invalid token') {
      tokenExpiresCallback()
    }
  }
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
  postOrEditGameData,
  putUserData,
  getUserDataByUsername
}
