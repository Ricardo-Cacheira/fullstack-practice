const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json(
      {
        error: 'title and url are required'
      }
    )
  }

  const blog = new Blog(  {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })

  blog.save().then((result) => {
    response.status(201).json(result)
  })
  .catch((error) => next(error))
})

blogsRouter.delete('/:id', async (request, response) => {
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