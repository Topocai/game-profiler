const BASE_FIELDS = 'name,id,url,first_release_date,summary,genres'

const IGDBUrl = 'https://api.igdb.com/v4/'

const BaseRequest = async (bearerAccessToken, type, { fields = '*', limit = 10, condition, search }) => {
  let bodyField = `fields ${fields}${type === 'games' ? ',parent_game' : ''}; limit ${limit};`
  bodyField += condition ? ` where ${condition};` : ''
  bodyField += search ? ` search "${search}";` : ''

  try {
    const response = await fetch(
      IGDBUrl + type,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${bearerAccessToken}`
        },
        body: bodyField
      }
    )
    const data = await response.json()
    const resolveData = data

    if (type === 'games') {
      if (data[0].parent_game) {
        const parentGame = await GetGameById(bearerAccessToken, data[0].parent_game, { queryFields: BASE_FIELDS })
        if (parentGame[0] !== undefined) {
          resolveData.unshift(parentGame[0])
        }
      }
    }

    return resolveData
  } catch (error) {
    console.log(error)
    return error
  }
}

const GetGameById = (bearerAccessToken, gameId, { queryFields }) => {
  const fields = queryFields ? queryFields + `,${BASE_FIELDS}` : BASE_FIELDS
  const queryResult = BaseRequest(bearerAccessToken, 'games', { fields, condition: `id = ${gameId}`, limit: 1 })
  return queryResult
}

const GetGames = (bearerAccessToken, { queryFields, limit }) => {
  const fields = queryFields ? queryFields + `,${BASE_FIELDS}` : BASE_FIELDS
  const queryResult = BaseRequest(bearerAccessToken, 'games', { fields, limit })

  return queryResult
}

const GetGameByName = (bearerAccessToken, name) => {
  console.log('Get by name:', name)
  const queryResult = BaseRequest(bearerAccessToken, 'games', { fields: BASE_FIELDS, search: name, limit: 3 })

  return queryResult
}

/**
 * Retrieves the cover URL of a game using the provided bearer access token and game ID.
 *
 * @param {string} bearerAccessToken - The bearer access token for authentication
 * @param {string} gameId - The ID of the game
 * @param {Object} options - An object containing optional parameters:
 *   @param {string} coverSize - The size of the cover image (default is 'thumb'). Available sizes are:
 *     - 'cover_small'
 *     - 'screenshot_med'
 *     - 'cover_big'
 *     - 'logo_med'
 *     - 'screenshot_big'
 *     - 'screenshot_huge'
 *     - 'thumb'
 *     - 'micro'
 *     - '720p'
 *     - '1080p'
 * @return {Promise<string>} A promise that resolves with the cover URL, or rejects with an error
 */
const GetCover = async (bearerAccessToken, gameId, { coverSize = 'thumb' }) => {
  console.log('Get cover:', gameId, coverSize)

  const queryResult = await BaseRequest(bearerAccessToken, 'covers', { fields: 'url', condition: `game = ${gameId}` })
  const sizes = [
    'cover_small',
    'screenshot_med',
    'cover_big',
    'logo_med',
    'screenshot_big',
    'screenshot_huge',
    'thumb',
    'micro',
    '720p',
    '1080p'
  ]

  if (sizes.indexOf(coverSize) === -1) { coverSize = sizes[0] }

  const coverUrl = queryResult.lenght > 0 ? queryResult[0].url.replace('t_thumb', `t_${coverSize}`) : 'No cover found'

  return coverUrl
}

module.exports = { GetGameById, GetGames, GetGameByName, GetCover, BaseRequest }
