import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => setTitle(event.target.value)
  const handleAuthorChange = (event) => setAuthor(event.target.value)
  const handleUrlChange = (event) => setUrl(event.target.value)

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
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
    <div>
      <h2>create new</h2>
      {blogForm()}
    </div>
  )
}


export default BlogForm