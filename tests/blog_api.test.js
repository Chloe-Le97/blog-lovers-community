const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('../utils/test_helper')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const initialBlogs = [
  { _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 },
  { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 },
  { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0 },
  { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 },
  { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 },
  { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  blogs = initialBlogs.map( async (blog) => {
    let blogObject = new Blog(blog)
    blogObject.save()
  })
  await Promise.all(blogs);
})


// describe('GET',()=>{
//   test('notes are returned as json', async () => {
//     const response = await api.get('/api/blogs')
//     await api
//       .get('/api/blogs')
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
  
//   })
//   test(' unique identifier property of the blog posts is named id', async () => {
//     const response = await api.get('/api/blogs') 
//     expect(response.body[0].id).toBeDefined()
//   })
// })

describe('POST',()=>{
  test('a new blog can be added', async()=>{
    const newBlog = {
      title: "SSH Handshake Explained",
      author: "Russell Jones",
      url: "https://gravitational.com/blog/ssh-handshake-explained/",
      likes: 6,
      userId:"5fb328f5b9bbfd35107b631b"
    };

    await api.post('/api/blogs').send(newBlog).expect(200).expect("Content-Type", /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.length+1)
  })

  test('like default is 0', async()=>{
    const newBlog = {
      title: "SSH Handshake Explained",
      author: "Russell Jones",
      url: "https://gravitational.com/blog/ssh-handshake-explained/",
    };

    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.body.likes).toEqual(0)
  })
})

  test('bad request if title and url are missing', async ()=>{
    const newBlog = {
      author: "Russell Jones",
    };
    
    await api.post('/api/blogs').send(newBlog).expect(400)
  })
  describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
  
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('`username` to be unique')
  
      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })
  afterAll(() => {
    mongoose.connection.close()
  })