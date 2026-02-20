import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Blog title',
    author: 'Author name',
    url: 'exampleUrl',
    likes: 0,
    user: {
      username: 'testUser',
      name: 'Test User'
    }
  }
  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        user={null}
      />
    )
  })

  test('renders title and author', async () => {
    const element = screen.getByText('Blog title Author name')
    expect(element).toBeDefined()
  })

  test('does NOT render url and likes by default', async () => {
    const element = screen.queryByText('exampleUrl')
    expect(element).toBeNull()
    const element2 = screen.queryByText('likes 0')
    expect(element2).toBeNull()
  })

  test('after clicking the button, url and likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText('exampleUrl')
    expect(url).toBeVisible()
    const likes = screen.getByText('likes 0')
    expect(likes).toBeVisible()
  })
})