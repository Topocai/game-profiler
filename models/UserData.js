const mongoose = require('mongoose')
const variables = require('../variables')

const UserDataSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  user_gender: {
    type: String,
    enum: {
      values: [Object.values(variables.genders).map((gender) => gender.display)],
      message: '{VALUE} not supported'
    }
  },
  user_platform: Array,
  birthday: {
    type: Date,
    validate: {
      validator: function (v) {
        return /^([1][12]|[0]?[1-9])[/-]([3][01]|[12]\d|[0]?[1-9])[/-](\d{4}|\d{2})$/.test(v)
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
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
