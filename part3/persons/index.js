const express = require('express')
const app = express()
app.use(express.json())

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
    console.log(people)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})