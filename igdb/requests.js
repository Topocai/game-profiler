const BASE_FIELDS = "name,id,url,first_release_date,summary,genres"

const BasicFetch = (bearer_access_token, type, {fields = "*", limit=10, condition, search }) => {
    let bodyField = `fields ${fields}${type == "games" ? ",parent_game" : ""}; limit ${limit};`
    bodyField += condition ? ` where ${condition};` : ""
    bodyField += search ? ` search "${search}";` : ""

    console.log(bodyField)
    return new Promise((resolve, reject) => {
        const promise = fetch(
            "https://api.igdb.com/v4/" + type,
            { method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${bearer_access_token}`,
              },
              body: bodyField
          })
          promise.then((response) => {
            if(type == "games") {
              response.json()
              .then((data) => {
                //If the first search has a parent put the parent on the first element
                console.log(data)
                if(data[0].parent_game) {
                  Get_GameById(bearer_access_token, data[0].parent_game, { queryFields: BASE_FIELDS })
                  .then((queryResult) => {
                    const newData = data
                    newData.unshift(queryResult[0])
                    return resolve(newData)
                  })      
                } else {
                  return resolve(data)
                }
              })
            } else {
              return resolve(response.json())
            }   
          })
          promise.catch((error) => {
            return reject(error)
          })
    })
}

const Get_GameById = (bearer_access_token, game_id, { queryFields } ) => {
  const fields = queryFields ? queryFields + `,${BASE_FIELDS}`: BASE_FIELDS
  const queryResult = BasicFetch(bearer_access_token, "games", { fields: fields, condition: `id = ${game_id}`, limit: 1 })
  return queryResult
}

const Get_Games = (bearer_access_token, { queryFields, limit }) => {
  const fields = queryFields ? queryFields + `,${BASE_FIELDS}`: BASE_FIELDS
  const queryResult = BasicFetch(bearer_access_token, "games", {fields: fields, limit: limit})
  
  return queryResult
}

const Get_GameByName = (bearer_access_token, name) => {
    console.log("Get by name:", name)
    const queryResult = BasicFetch(bearer_access_token, "games", { fields: BASE_FIELDS, search: name, limit: 3 })

    return queryResult
}

/**
 * Retrieves the cover URL of a game using the provided bearer access token and game ID.
 *
 * @param {string} bearer_access_token - The bearer access token for authentication
 * @param {string} game_id - The ID of the game
 * @param {Object} options - An object containing optional parameters:
 *   @param {string} cover_size - The size of the cover image (default is 'thumb'). Available sizes are:
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
const Get_Cover = (bearer_access_token, game_id, { cover_size='thumb' }) => {
  let coverUrl;
  console.log("Get cover:", game_id, cover_size)
  return new Promise((resolve, reject) => {
    BasicFetch(bearer_access_token, "covers", {fields: "url", condition: `game = ${game_id}`})
    .then((queryResult) => {
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

        if (sizes.indexOf(cover_size) === -1) 
            cover_size = sizes[0]

        coverUrl = queryResult[0].url.replace("t_thumb", `t_${cover_size}`)
        resolve(coverUrl)
    })
    .catch((error) => {
        reject(error)
    })
  })
}

module.exports = { Get_GameById, Get_Games, Get_GameByName, Get_Cover }