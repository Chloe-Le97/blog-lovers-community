const app = require('./app') // the actual Express application
const http = require('http')
const logger = require('./utils/logger')

const server = http.createServer(app)

const config = process.env.PORT

server.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${config}`)
})