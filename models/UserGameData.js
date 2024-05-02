const mongoose = require('mongoose')

const UserGameData = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  game_id: {
    type: Number,
    unique: true,
    required: true
  },
  status: String,
  score: Number,
  started_at: Date,
  finished_at: Date,
  hours_played: Number,
  platform_played: Array,
  review: String,
  favorite: Boolean
})

UserGameData.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
  }
})

module.exports = mongoose.model('UserGameData', UserGameData)
