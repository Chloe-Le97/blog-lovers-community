const app = require('./app') // the actual Express application
const http = require('http')
const logger = require('./utils/logger')

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

