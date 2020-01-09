const express = require('express')
const router = express.Router()
const todoController = require('../controller/todo.controller')

/**
 * @desc To create a new todo
 * @route POST /api/v1.0/todo/:list_id
 */
router.post('/:list_id', todoController.addTodo)

/**
 * @desc To get all todos
 * @route GET /api/v1.0/todo/:list_id
 */
router.get('/:list_id', todoController.loadAllTodo)

/**
 * @desc Update a todo
 * @route PUT /api/v1.0/todo/:todo_id
 */
router.put('/:todo_id', todoController.updateTodo)

/**
 * @desc Delete a todo
 * @route DELETE /api/v1.0/todo/:todo_id
 */
router.delete('/:todo_id', todoController.deleteTodo)

module.exports = router
