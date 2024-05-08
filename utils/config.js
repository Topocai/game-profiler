require('dotenv').config()

const mongoURI = process.env.NODE_ENV !== 'production' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI_TEST
const PORT = process.env.PORT || 3001

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET

const IGDB_TOKEN = null

module.exports = {
  mongoURI,
  PORT,
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
  IGDB_TOKEN
}
