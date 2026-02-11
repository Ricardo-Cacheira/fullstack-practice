const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if(!password || password.length < 3) {
    return response.status(400).json({ error: 'password is required and must be at least 3 characters long' })
  }

  const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%&*]{8,}$/
  if(!regex.test(password)) {
    return response.status(400).json({ error: 'password must be at least 8 characters long and contain at least 1 letter and 1 digit' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter