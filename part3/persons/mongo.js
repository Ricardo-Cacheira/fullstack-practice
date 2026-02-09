const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ricardocacheira_db_user:${password}@cluster0.dnnlnj3.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Number = mongoose.model('Number', numberSchema)

if(process.argv.length === 5)
{
  const number = new Number({
    name: process.argv[3],
    number: process.argv[4],
  })

  number.save().then(() => {
    console.log(`added ${number.name} number ${number.number} to phonebook`)
    mongoose.connection.close()
  })
}
else if(process.argv.length === 3)
{
  Number.find({}).then(result => {
    let resultString = 'phonebook:\n'
    result.forEach(number => {
      resultString = resultString.concat(`${number.name} ${number.number}\n`)
    })
    console.log(resultString)
    mongoose.connection.close()
  })
}