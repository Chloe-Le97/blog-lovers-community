const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs',{likes:1,title:1,author:1,url:1,id:1})
    response.json(users)
  })

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if(!body.username||!body.password){return response.status(400).send('Please provide username and password')}
  if(body.username.length<3){return response.status(400).send('The username must contain at least 3 characters')}
  if(body.password.length<3){return response.status(400).send('The password must contain at least 3 characters')}
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })
  try{
    const savedUser = await user.save()
    response.json(savedUser)
  }
    catch(error){return response.status(400).send(error)}

 
})

module.exports = usersRouter