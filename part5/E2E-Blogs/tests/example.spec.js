const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

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
  })
})