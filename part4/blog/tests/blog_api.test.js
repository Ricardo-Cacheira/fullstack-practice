const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test.only('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)

})

test.only('all blogs have an id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => {
    assert.ok(blog.id)
  })
})

test.only('new valid blog can be created', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'https://example.com/new-blog',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.body.map(b => b.title)
  assert.ok(titles.includes('New Blog'))  
})

test.only('default likes value is 0', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'https://example.com/new-blog'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.ok(response.body.likes === 0)
})

after(async () => {
  await mongoose.connection.close()
})