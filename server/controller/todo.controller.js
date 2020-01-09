/**
 * @desc Function to add a new todo under list_id
 * @param  req
 * @param  res
 */
const addTodo = (req, res) => {
  res.send('Add a new todo to list ' + req.params.list_id)
}

/**
 * @desc Function to laod all todos under list_id
 * @param  req
 * @param  res
 */
const loadAllTodo = (req, res) => {
  res.send('Load all todos of list ' + req.params.list_id)
}

/**
 * @desc Function to update a todo using todo_id
 * @param  req
 * @param  res
 */
const updateTodo = (req, res) => {
  res.send('Update todo ' + req.params.todo_id)
}

/**
 * @desc Function to delete a new todo using todo_id
 * @param  req
 * @param  res
 */
const deleteTodo = (req, res) => {
  res.send('Delete todo ' + req.params.todo_id)
}

module.exports = { addTodo, loadAllTodo, updateTodo, deleteTodo }
