const BASE_FIELDS = 'name,id,url,first_release_date,summary,genres,similar_games'

const IGDBUrl = 'https://api.igdb.com/v4/'

const BaseRequest = async (bearerAccessToken, type, { fields = '*', limit = 10, condition, search, sort, context = undefined }) => {
  let bodyField = `fields ${fields}${type === 'games' ? ',parent_game' : ''}; limit ${limit};`
  bodyField += sort ? ` sort ${sort};` : ''
  bodyField += condition ? ` where ${condition};` : ''
  bodyField += search ? ` search "${search}";` : ''

  console.log(bodyField)

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

    if (type === 'games' && context !== 'by_id') {
      if (data[0].parent_game) {
        const parentGame = await GetGameById(bearerAccessToken, data[0].parent_game, { queryFields: BASE_FIELDS })
        if (parentGame !== undefined) {
          resolveData.unshift(parentGame)
        }
      }
    }

    return resolveData
  } catch (error) {
    console.log(error)
    return error
  }
}

const GetGameById = async (bearerAccessToken, gameId, { queryFields }) => {
  const fields = queryFields ? queryFields + `,${BASE_FIELDS}` : BASE_FIELDS
  const queryResult = await BaseRequest(bearerAccessToken, 'games', { fields, condition: `id = ${gameId}`, limit: 1, context: 'by_id' })
  return queryResult[0]
}

const GetGames = async (bearerAccessToken, { queryFields, limit, conditions, sort }) => {
  const fields = queryFields ? queryFields + `,${BASE_FIELDS}` : BASE_FIELDS
  console.log(sort)
  const queryResult = await BaseRequest(bearerAccessToken, 'games', { fields, limit, condition: conditions, sort })

  return queryResult
}

const GetGameByName = async (bearerAccessToken, name, { conditions }) => {
  console.log('Get by name:', name)
  const queryResult = await BaseRequest(bearerAccessToken, 'games', { fields: `${BASE_FIELDS}, aggregated_rating`, search: name, limit: 6, condition: conditions })

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
const GetCover = async (bearerAccessToken, gameId, { coverSize = 'cover_big' }) => {
  console.log('Get cover:', gameId, coverSize)

  try {
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

    if (queryResult[0] === undefined) {
      return 'No cover found'
    }

    if (sizes.indexOf(coverSize) === -1) { coverSize = sizes[2] }

    const url = queryResult[0].url

    const coverUrl = url != null ? url.replace('t_thumb', `t_${coverSize}`) : 'No cover found'

    return coverUrl
  } catch {
    return new Error('No cover found')
  }
}

module.exports = { GetGameById, GetGames, GetGameByName, GetCover, BaseRequest }
