const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password123', 10)
    const user = new User({ username: 'ricardo', passwordHash, name: 'Ricardo', blogs: [] })
    const savedUser = await user.save()

    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs.map(blog => ({ ...blog, user: savedUser._id, author: savedUser.name })))
    })

    describe('validate blog data', () => {

        test('all blogs are returned', async () => {
            const response = await api.get('/api/blogs')
            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })

        test('all blogs have an id', async () => {
            const response = await api.get('/api/blogs')
            response.body.forEach((blog) => {
                assert.ok(blog.id)
            })
        })
    })

    describe('adding blog data', () => {
        test('new valid blog can be created', async () => {

        const login = await api
            .post('/api/login')
            .send({ username: 'ricardo', password: 'password123' })
            .expect(200)

        const token = login.body.token

        const newBlog = {
            title: 'New Blog',
            url: 'https://example.com/new-blog',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .auth(token, { type: 'bearer' })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await api.get('/api/blogs')
        assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.body.map(b => b.title)
        assert.ok(titles.includes('New Blog'))  
        })

        test('default likes value is 0', async () => {

            const login = await api
                .post('/api/login')
                .send({ username: 'ricardo', password: 'password123' })
                .expect(200)

            const token = login.body.token

            const newBlog = {
                title: 'New Blog',
                url: 'https://example.com/new-blog'
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .auth(token, { type: 'bearer' })
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.ok(response.body.likes === 0)
        })

        test('adding a blog fails without token provided', async () => {

        const newBlog = {
            title: 'New Blog',
            url: 'https://example.com/new-blog',
            likes: 5
        }

        const result = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()

        assert(result.body.error.includes('token invalid'))

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('blog without title or url is not added', async () => {

            
        const login = await api
            .post('/api/login')
            .send({ username: 'ricardo', password: 'password123' })
            .expect(200)

        const token = login.body.token

        const newBlog = {
            author: 'New Author',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .auth(token, { type: 'bearer' })
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('manipulating blog data', () => {
        test('a blog can be deleted', async () => {
            const login = await api
                .post('/api/login')
                .send({ username: 'ricardo', password: 'password123' })
                .expect(200)

            const token = login.body.token
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .auth(token, { type: 'bearer' })
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

            const titles = blogsAtEnd.map(b => b.title)
            assert.ok(!titles.includes(blogToDelete.title))
        })

        test('a blog can be updated', async () => {
            const login = await api
                .post('/api/login')
                .send({ username: 'ricardo', password: 'password123' })
                .expect(200)

            const token = login.body.token
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]

            const updatedBlogData = {
                title: 'Updated Blog',
                url: 'https://example.com/updated-blog',
                likes: 10
            }

            const response = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlogData)
                .auth(token, { type: 'bearer' })
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(response.body, { ...updatedBlogData, id: blogToUpdate.id, user: blogToUpdate.user.toString() })
        })
    })
})

after(async () => {
  await mongoose.connection.close()
})