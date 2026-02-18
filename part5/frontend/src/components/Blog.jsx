import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const minimizedBlog = () =>
  (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide': 'view'}
        </button>
      </div>
    </div>
  )

  const fullBlog = () =>
  (
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
        <button onClick={() => {}}>
          like
        </button>
      </li>
      <li>{blog.user.name}</li>
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