const mongoose = require('mongoose')
const config = require('./utils/config')

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

//const password = process.argv[2]

const url = config.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'TEST NOTE',
  important: false,
})

note.save().then(() => {
  console.log('note saved!')
  mongoose.connection.close()
})

// Note.find({ important: true }).then(result => {
// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })