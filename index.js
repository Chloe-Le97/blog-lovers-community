const app = require('./app') // the actual Express application
const http = require('http')
const logger = require('./utils/logger')

app.use(express.static(__dirname + '/react-client/dist/'));

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/react-client/dist/index.html'));
});

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

