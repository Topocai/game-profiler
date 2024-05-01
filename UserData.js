/**
 * Constructor function for creating a new UserData object with initial properties.
 *
 */
function UserData() {
  this.user_genre = null
  this.user_platform = []
  this.birthday = null
  this.created_at = Date.now()
  this.gamesList = 
    { 
    finished: [],
    playing: [],
    abandoned: [],
    on_hold: [],
    wishlist: [],
    favorites: []
    }
  this.userGamesData = [] // array of UserGameData objects
}

/**
 * Constructor function for UserGameData class.
 */
function UserGameData() {
    this.game_id = null;
    this.status = null;
    this.score = null;
    this.started_at = null;
    this.finished_at = null;
    this.hours_played = null;
    this.platform_played = [];
    this.review = null;
    this.favorite = null;
}