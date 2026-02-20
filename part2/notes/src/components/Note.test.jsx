import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

//   const element = screen.getByText('Component testing is done with react-testing-library')
//   const element = screen.getByText(
//     'Does not work anymore :(', { exact: false }
//   )
//   const element = await screen.findByText('Does not work anymore :(')
//   expect(element).toBeDefined()

  const element = screen.queryByText('do not want this thing to be rendered')
  screen.debug(element)
  screen.debug()
  // expect(element).toBeNull()

/*
It is, however, recommended to search for elements primarily using methods other than the container object and CSS selectors.
CSS attributes can often be changed without affecting the application's functionality, and users are not aware of them.
It is better to search for elements based on properties visible to the user, for example, by using the getByText method.
This way, the tests better simulate the actual nature of the component and how a user would find the element on the screen.
  const { container } = render(<Note note={note} />)

  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
*/

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})