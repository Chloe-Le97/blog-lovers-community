const app = require('./app') // the actual Express application
const http = require('http')
const logger = require('./utils/logger')

const server = http.createServer(app)

config = process.env.PORT || 3000

server.listen(process.env.PORT || 3000, () => {
  logger.info(`Server running on port ${config}`)
})