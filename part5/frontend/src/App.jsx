import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [messageType, setMessageType] = useState('notification')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch {
      setMessageType('error')
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <Login
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
        />
    </Togglable>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
    .create(blogObject)
    .then(returnedBlog => {
      returnedBlog.user = user.id
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setMessageType('notification')
    })
    .catch(error => {
      setMessage( error.message)
      setMessageType('error')
    })
  }

  const likeBlog = async (id, blog) => {
    try{
      const updatedBlog = await blogService.update(id, blog)
      const newBlogs = blogs.map(b => (b.id !== id ? b : updatedBlog))
      setBlogs(newBlogs)
    }
    catch
    {
      setMessage(`Could not update blog`)
      setMessageType('error')
    } 
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <div>
      {user.name} logged in 
      <button onClick={logout}>logout</button>
      <br />
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm
          createBlog={addBlog}
          user={user}
          blogs={blogs}
          setBlogs={setBlogs}
          setMessage={setMessage}
          setMessageType={setMessageType}/>
      </Togglable>
    </div>
  )



  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} type={messageType} />
      {!user && loginForm()}
      {user && (
        <div>
          {blogForm()}
        </div>
      )}
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} />
      )}
    </div>
  )
}

export default App