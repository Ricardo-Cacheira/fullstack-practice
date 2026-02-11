const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 4, //make it so «test» is valid
    required: true,
    unique: true, // this ensures the uniqueness of username
    validate:
    {
      validator: function(v) {
        return /^[a-zA-Z0-9_]*$/.test(v)
      },
      message: props => `${props.value} is not a valid username!`
    },
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User