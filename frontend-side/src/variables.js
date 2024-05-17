import variablesServices from './services/variables'

const CARD_SIZES = {
  NORMAL: 'normal',
  SMALL: 'small'
}

const GRID_CARD_CONTEXTS = {
  NORMAL: 'normal',
  USER_MINI_LIST: 'user-mini-list'
}

const LIVE_VARIABLES = {
  PLATFORMS: {},
  GENRES: {},
  GAME_LISTS: {},
  async updateVariables () {
    this.PLATFORMS = await getPlatforms()
    this.GENRES = await getGenres()
    this.GAME_LISTS = await getGameLists()
  }
}

const getPlatforms = async () => {
  const response = await variablesServices.platforms()
  return response
}

const getGenres = async () => {
  const response = await variablesServices.genres()
  return response
}

const getGameLists = async () => {
  const response = await variablesServices.gameLists()
  return response
}

export default {
  CARD_SIZES,
  GRID_CARD_CONTEXTS,
  LIVE_VARIABLES
}
