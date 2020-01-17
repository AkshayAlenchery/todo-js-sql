const db = require('../models/todo.models')

const createError = (status, message) => {
  return {
    timestamp: Date(),
    status: status,
    message: message
  }
}

/**
 * @desc Function to add a new todo under list_id
 * @param  req
 * @param  res
 */
const addTodo = async (req, res) => {
  const listId = req.params.list_id
  const { name } = req.body
  try {
    let sql = 'SELECT * FROM lists WHERE list_id = $1'
    let result = await db.executeQuery(sql, [listId])
    if (result.rowCount > 0) {
      sql = 'INSERT INTO todos (list_id, todo_name) VALUES ($1, $2) RETURNING *'
      result = await db.executeQuery(sql, [listId, name])
      res.status(200).json(result.rows[0])
    } else res.status(404).json(createError(404, 'List not found. Cannot add todo'))
  } catch (err) {
    res.status(500).json(createError(500, 'Could not create todo'))
  }
}

/**
 * @desc Function to laod all todos under list_id
 * @param  req
 * @param  res
 */
const loadAllTodo = async (req, res) => {
  const listId = req.params.list_id
  try {
    let sql = 'SELECT * FROM lists WHERE list_id = $1'
    let result = await db.executeQuery(sql, [listId])
    if (result.rowCount > 0) {
      sql = 'SELECT * FROM todos WHERE list_id = $1 ORDER BY priority DESC, scheduled DESC'
      result = await db.executeQuery(sql, [listId])
      if (result.rowCount > 0) res.status(200).json(result.rows)
      else res.status(200).json({ todoCount: 0, message: 'No todos present' })
    } else res.status(404).json(createError(404, 'List not found.'))
  } catch (err) {
    res.status(500).json(createError(500, 'Could not list todos'))
  }
}

/**
 * @desc Function to update a todo using todo_id
 * @param  req
 * @param  res
 */
const updateTodo = async (req, res) => {
  const todoId = req.params.todo_id
  const { type, value } = req.body
  let sql = 'UPDATE todos SET'
  try {
    switch (type) {
      case 'name':
        sql += ' todo_name = $1'
        break
      case 'completed':
        sql += ' completed = $1'
        break
      case 'priority':
        sql += ' priority = $1'
        break
      case 'scheduled':
        sql += ' scheduled = $1'
        break
      case 'note':
        sql += ' note = $1'
        break
      default:
        return res.status(404).json(createError(404, 'Could not find what you are looking for!'))
    }
    sql += ' WHERE todo_id = $2 RETURNING *'
    const result = await db.executeQuery(sql, [value, todoId])
    if (result.rowCount > 0) res.status(200).json(result.rows[0])
    else res.status(404).json(createError(404, 'Todo not found'))
  } catch (err) {
    res.status(500).json(createError(500, 'Could not update todo'))
  }
}

/**
 * @desc Function to delete a new todo using todo_id
 * @param  req
 * @param  res
 */
const deleteTodo = async (req, res) => {
  const todoId = req.params.todo_id
  const sql = 'DELETE FROM todos WHERE todo_id = $1 RETURNING *'
  try {
    const result = await db.executeQuery(sql, [todoId])
    if (result.rowCount > 0) res.status(200).json({ deleted: true })
    else res.status(404).json(createError(404, 'Todo not found'))
  } catch (err) {
    res.status(500).json(createError(500, 'Could not delete todo'))
  }
}

module.exports = { addTodo, loadAllTodo, updateTodo, deleteTodo }
