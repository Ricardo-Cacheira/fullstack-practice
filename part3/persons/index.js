require('dotenv').config()
const express = require('express')
const Number = require('./models/phone')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(express.static('dist'))

morgan.token('type', function (req) { return JSON.stringify(req.body) || 'unknown' })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

app.get('/api/persons', (request, response) => {
  Number.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response) => {
  Number.find({}).then(persons => {
    const info = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    response.send(info)
  })

})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Number.findById(id).then(person => {
    if (person)
      response.json(person)
    else
    {
      response.statusMessage = 'Person not found'
      return response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Number.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Number.findById(request.params.id)
    .then(entry => {
      if (!entry) {
        return response.status(404).end()
      }
      entry.name = name
      entry.number = number
      return entry.save().then((updatedNumber) => {
        response.json(updatedNumber)
      })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})