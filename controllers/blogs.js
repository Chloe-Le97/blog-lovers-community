const blogsRouter = require('express').Router()
const { response, request } = require('express')
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
blogsRouter.post('/', (request, response) => {
    const blog = new Blog({...request.body})
    if (typeof blog.title === 'undefined' || blog.title === null || typeof blog.url === 'undefined' || blog.url === null) {
      response.status(400).end()
    }
     else {blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })}
  })

blogsRouter.delete('/:id',(request,response)=>{
  Blog.findByIdAndRemove(request.params.id)
      .then(result =>{
        response.status(204).end()
      })
})

blogsRouter.put('/:id',(request,response)=>{
  const blog={
    likes: request.body.likes
  }
  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(result => response.status(201).json(result))
})

module.exports = blogsRouter