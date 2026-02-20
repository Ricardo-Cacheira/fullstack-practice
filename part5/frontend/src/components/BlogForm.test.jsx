import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()
    render(
      <BlogForm
        createBlog={createBlog}
      />
    )

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'Test Title')
    await user.type(authorInput, 'Author Name')
    await user.type(urlInput, 'testUrl.com')
    await user.click(sendButton)
    console.log(createBlog.mock.calls)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Test Title')
    expect(createBlog.mock.calls[0][0].author).toBe('Author Name')
    expect(createBlog.mock.calls[0][0].url).toBe('testUrl.com')
  })
})