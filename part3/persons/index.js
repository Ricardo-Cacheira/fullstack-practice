require('dotenv').config()
const express = require('express')
const Number = require('./models/phone')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(express.static('dist'))

morgan.token('type', function (req, res) { return JSON.stringify(req.body) || 'unknown' })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

app.get('/api/persons', (request, response) => {
    Number.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/info', (request, response) => {
    const info = `<p>Phonebook has info for ${people.length} people</p><p>${new Date()}</p>`
    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = people.find(person => person.id === id)
    if (person)
        response.json(person)
    else
    {
        response.statusMessage = "Person not found";
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    people = people.filter(person => person.id !== id)
    // console.log(people)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body)
    {
        return response.status(400).json({
            error: 'body missing'
        })
    }

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    //ignore for now, as we will later check for duplicates in the database
    // if(people.find(person => person.name === body.name)) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Number({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})