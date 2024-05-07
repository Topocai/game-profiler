const mongoose = require('mongoose')

const UserDataSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  user_avatar: String,
  user_gender: String,
  user_platform: Array,
  birthday: Date,
  created_at: Date,
  gamesList: Object,
  userGamesData: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserGameData'
    }
  ]
})

UserDataSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
  }
})

module.exports = mongoose.model('UserData', UserDataSchema)
