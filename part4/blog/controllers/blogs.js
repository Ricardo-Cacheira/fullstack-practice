const blogsRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json(
      {
        error: 'title and url are required'
      }
    )
  }

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog(  {
    title: body.title,
    author: user.name,
    url: body.url,
    user: user._id,
    likes: body.likes || 0,
  })

  blog.save().then((result) => {
    response.status(201).json(result)
  })
  .catch((error) => next(error))
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  const user = request.user

  if(!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  if(user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'only the creator of the blog can delete it' })
  }

  await Blog.findByIdAndDelete(request.params.id)

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog)
    return response.status(404).end()

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})


module.exports = blogsRouter