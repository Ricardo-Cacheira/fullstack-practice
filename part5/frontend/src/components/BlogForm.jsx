import { useState } from 'react'
import blogService from '../services/blogs'
import Blog from './Blog'

const BlogForm = ({ user, blogs, setBlogs, setMessage, setMessageType }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => setTitle(event.target.value)
  const handleAuthorChange = (event) => setAuthor(event.target.value)
  const handleUrlChange = (event) => setUrl(event.target.value)

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url,
      user: user.id
    }

    blogService
    .create(blogObject)
    .then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage(`a new blog ${title} by ${author} added`)
      setMessageType('notification')
    })
    .catch(error => {
      setMessage( error.message)
      setMessageType('error')
    })
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title: 
          <input value={title} onChange={handleTitleChange} />
        </label>
      </div>
      <div>
        <label>
          author: 
          <input value={author} onChange={handleAuthorChange} />
        </label>
      </div>
      <div>
        <label>
          url: 
          <input value={url} onChange={handleUrlChange} />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )

  return(
    <>
    {user && (
        <div>
          <h2>create new</h2>
          {blogForm()}
        </div>
    )}
    </>
  )
}


export default BlogForm