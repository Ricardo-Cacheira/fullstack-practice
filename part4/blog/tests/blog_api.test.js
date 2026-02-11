const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    })

    describe('validate blog data', () => {

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
    })

    describe('adding blog data', () => {
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

        test('blog without title or url is not added', async () => {
        const newBlog = {
            author: 'New Author',
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    
    describe('manipulating blog data', () => {
        test.only('a blog can be deleted', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

            const titles = blogsAtEnd.map(b => b.title)
            assert.ok(!titles.includes(blogToDelete.title))
        })
    })
})

after(async () => {
  await mongoose.connection.close()
})