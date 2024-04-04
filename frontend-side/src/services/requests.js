import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api'

const get_random_games = () => {
    const promise = axios.get(`${BASE_URL}/games/search/Doom eternal`)
    return promise.then((response) => response.data)
}

const get_cover = (id) => {
    const promise = axios.get(`${BASE_URL}/games/cover/${id}`)
    return promise.then((response) => response.data)
}

const get_genders = () => {
    const promise = axios.get(`${BASE_URL}/profile/genders`)
    return promise.then((response) => response.data)
}

const get_plataforms = () => {
    const promise = axios.get(`${BASE_URL}/profile/plataforms`)
    return promise.then((response) => response.data)
}

export default { get_random_games, get_cover, get_genders, get_plataforms }