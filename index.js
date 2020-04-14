const express = require('express')
const server = express()

const port = process.env.PORT || 4000;

//routers
const projectRouter = require('./routers/projectRouter')
const actionRouter = require('./routers/actionRouter')


server.use(express.json())
server.use('/api/projects', projectRouter)
server.use('/api/actions', actionRouter)

server.get('/', (req, res) => {
  res.status(200).send(`<h1>Server is working.</h1>`)
})


server.listen(port, () => {
  console.log(` Server listening at port: ${port}`)
})