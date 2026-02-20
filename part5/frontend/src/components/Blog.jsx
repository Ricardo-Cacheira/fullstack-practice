import { useState } from 'react'

const Blog = ({ user, blog, likeBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)
  const isFromUser = user === null || user === undefined
  ? false
  : user.username === blog.user.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removeBlog = () => {
    deleteBlog(blog.id, blog)
  }

  const addLike = () => {
    const likedBlog = { ...blog, likes: blog.likes+1 }
    likeBlog(blog.id, likedBlog)
  }

  const minimizedBlog = () => (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide': 'view'}
        </button>
      </div>
    </div>
  )

  const fullBlog = () => (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide': 'view'}
        </button>
      </div>
      <li>{blog.url}</li>
      <li>
        likes {blog.likes}
        <button onClick={addLike}>
          like
        </button>
      </li>
      <li>{blog.user.name}</li>
      {isFromUser ? <button onClick={removeBlog}>delete</button> : <></>}
    </div>
  )

  return (
    <div>
      {!visible && minimizedBlog()}
      {visible && fullBlog()}
    </div>
  )
}

export default Blog