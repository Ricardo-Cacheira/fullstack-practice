const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(express.static('dist'))

morgan.token('type', function (req, res) { return JSON.stringify(req.body) || 'unknown' })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// app.use(requestLogger)

let people =
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(people)
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

const generateId = () => {
    const id = Math.floor(Math.random(0, ) * 10000)
    return String(id)
}

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

    if(people.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    people = people.concat(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})