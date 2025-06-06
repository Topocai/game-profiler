/* eslint-disable camelcase */
/**
 * Constructor function for creating a new UserData object with initial properties.
 *
 */
function UserData (
  userId,
  displayName,
  userDataObject
) {
  this.user_name = displayName
  this.user_id = userId
  this.user_avatar = userDataObject ? userDataObject.user_avatar : null
  this.user_gender = userDataObject ? userDataObject.user_gender : null
  this.user_platform = userDataObject ? userDataObject.user_platform : []
  this.birthday = userDataObject ? userDataObject.birthday : null
  this.created_at = userDataObject ? userDataObject.created_at : Date.now()
  this.gamesList = userDataObject
    ? userDataObject.gamesList
    : {
        finished: [],
        playing: [],
        abandoned: [],
        on_hold: [],
        wishlist: [],
        favorites: []
      }
  this.userGamesData = userDataObject ? userDataObject.userGamesData : [] // array of UserGameData objects
}

/**
 * Constructor function for UserGameData class.
 */

function UserGameData (gameId) {
  this.game_id = gameId
  this.status = null
  this.score = null
  this.started_at = null
  this.finished_at = null
  this.hours_played = null
  this.platform_played = []
  this.review = null
  this.favorite = null
}

module.exports = {
  UserData,
  UserGameData
}
