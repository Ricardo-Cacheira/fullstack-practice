const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, loginWith, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Blog Tester',
        username: 'test',
        password: 'password123'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('username')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('login fails with wrong password', async ({ page }) => {
      await loginWith(page, 'test', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Blog Tester logged in')).not.toBeVisible()
    })

    test('user can log in', async ({ page }) => {
      await loginWith(page, 'test', 'password123')

      await expect(page.getByText('Blog Tester logged in')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'test', 'password123')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'author name', 'http://example.com')
      await expect(page.getByText('a blog created by playwright author name')).toBeVisible()
    })

    test('a new blog can be liked', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'author name', 'http://example.com')
      await expect(page.getByText('a blog created by playwright author name')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted by the user who created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'author name', 'http://example.com')
      await expect(page.getByText('a blog created by playwright author name')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()
      await expect(page.getByText('a blog created by playwright author name')).not.toBeVisible()
    })

    test('only the creator can see the delete button', async ({ page, request }) => {
      await createBlog(page, 'a blog created by playwright', 'author name', 'http://example.com')
      await expect(page.getByText('a blog created by playwright author name')).toBeVisible()

      await request.post('/api/users', {
        data: {
          name: 'new Tester',
          username: 'test2',
          password: 'password123'
        }
      })
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'test2', 'password123')
      await expect(page.getByText('new Tester logged in')).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()
      // await expect(page.getByText('delete')).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page, request }) => {
      await createBlog(page, 'blogName', 'author name', 'http://example.com')
      await expect(page.getByText('blogName author name')).toBeVisible()
      await createBlog(page, 'blogName2', 'author name', 'http://example.com')
      await expect(page.getByText('blogName2 author name')).toBeVisible()
      
      const viewButtons = await page.getByRole('button', { name: 'view' }).all()
      await viewButtons[0].click()
      await likeOpenBlog(page)
      await expect(page.getByText('likes 1')).toBeVisible()
      await page.getByRole('button', { name: 'hide' }).click()
      await viewButtons[1].click()
      await likeOpenBlog(page)
      await expect(page.getByText('likes 1')).toBeVisible()
      await likeOpenBlog(page)
      await expect(page.getByText('likes 2')).toBeVisible()
      await page.getByRole('button', { name: 'hide' }).click()
      await page.pause()
      const blogNames = await page.locator('.blog').all()
      await expect(blogNames[0]).toHaveText('blogName2 author nameview')
      await expect(blogNames[1]).toHaveText('blogName author nameview')
    })

    test('blogs are ordered by likes (improved)', async ({ page }) => {
        await page.getByText('blog1').getByRole('button', { name: 'view'}).click()
        await page.getByText('blog2').getByRole('button', { name: 'view'}).click()
        await page.getByText('blog3').getByRole('button', { name: 'view'}).click()

        await page.pause()
        const button1 = page.getByText('blog1').getByRole('button', { name: 'like'})
        await likeTimes(page, button1, 1)
        await page.getByText('blog1').getByRole('button', { name: 'hide'}).click()

        let button2 = page.getByText('blog2').getByRole('button', { name: 'like'})
        await likeTimes(page, button2, 3)
        await page.getByText('blog2').getByRole('button', { name: 'hide'}).click()

        let button3 = page.getByText('blog3').getByRole('button', { name: 'like'})
        await likeTimes(page, button3, 2)
        await page.getByText('blog3').getByRole('button', { name: 'hide'}).click()

        const blogDivs = await page.locator('div.blog').all()

        expect(blogDivs[0]).toHaveText('blog2 by Ted Testerview') 
        expect(blogDivs[1]).toHaveText('blog3 by Ted Testerview') 
        expect(blogDivs[2]).toHaveText('blog1 by Ted Testerview') 
      })
  })
})