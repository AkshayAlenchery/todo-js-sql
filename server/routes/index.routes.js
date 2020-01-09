const express = require('express')
const router = express.Router()
const listRouter = require('./list.routes')

router.use('/list', listRouter)

module.exports = router
