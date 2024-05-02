const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  password: String,
  displayName: {
    type: String,
    minlength: [3, 'Display name must be at least 3 characters long'],
    maxlenght: [20, 'Display name must be at most 20 characters long']
  },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[\w.=-]+@[\w.-]+\.[\w]{2,3}$/.test(v)
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
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
