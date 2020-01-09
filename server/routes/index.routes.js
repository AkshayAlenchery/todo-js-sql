const express = require('express')
const router = express.Router()
const listRouter = require('./list.routes')
const todoRouter = require('./todo.routes')

router.use('/list', listRouter)
router.use('/todo', todoRouter)

module.exports = router
