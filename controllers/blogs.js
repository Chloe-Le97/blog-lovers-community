const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const { response, request } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await  Blog
      .find({}).populate('user',{username:1,name:1})
    
  response.json(blogs)    
  })
  
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)


  const blog = new Blog({
    likes: body.likes,
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id
  })
    if (typeof blog.title === 'undefined' || blog.title === null || typeof blog.url === 'undefined' || blog.url === null) {
      response.status(400).end()
    }
     else {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      response.json(savedBlog)
     }
  })

blogsRouter.delete('/:id', async (request,response)=>{
  
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  
  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)

  if(blog.user.toString()=== user.id.toString()){
    Blog.findByIdAndRemove(request.params.id)
    .then(result =>{
      response.status(204).end()
    })
  }
})

blogsRouter.put('/:id',(request,response)=>{
  const blog={
    likes: request.body.likes
  }
  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(result => response.status(201).json(result))
})

module.exports = blogsRouter