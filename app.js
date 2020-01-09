const express = require('express')
const dotenv = require('dotenv')
const routes = require('./server/routes/index.routes')
const app = express()

dotenv.config()
app.use(express.json())
app.use('/api/v1.0', routes)

app.listen(process.env.APP_PORT, () =>
  console.log(`Server is running on port ${process.env.APP_PORT}`)
)
