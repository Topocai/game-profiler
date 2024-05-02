const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  password: String,
  displayName: String,
  email: String,
  UserData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData'
  }
})

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
    delete returnedObject.password
  }
})

module.exports = mongoose.model('User', UserSchema)
