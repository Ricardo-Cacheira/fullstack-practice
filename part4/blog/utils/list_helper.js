const dummy = (blogs) => {
  return 1
}

const likeCount = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })
  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCount = {}
  blogs.forEach(blog => {
    authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
  })

  const maxBlogs = Math.max(...Object.values(authorCount))
  const mostBlogsAuthor = Object.keys(authorCount).find(author => authorCount[author] === maxBlogs)

  return {
    author: mostBlogsAuthor,
    blogs: maxBlogs
  }
}

module.exports = {
  dummy,
  likeCount,
  favoriteBlog,
  mostBlogs
}