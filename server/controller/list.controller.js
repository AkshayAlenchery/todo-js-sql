const db = require('../models/todo.models')

const createError = (status, message) => {
  return {
    timestamp: Date(),
    status: status,
    message: message
  }
}

/**
 * @desc Function to create a new list
 * @param req
 * @param res
 * @returns {object} result
 */
const createList = async (req, res) => {
  const { listName } = req.body
  try {
    const sql = 'INSERT INTO lists (list_name) VALUES ($1) RETURNING list_id, list_name'
    const result = await db.executeQuery(sql, [listName])
    res.status(200).json(result.rows[0])
  } catch (err) {
    res.status(500).json(createError(500, 'Cannot create the list'))
  }
}

/**
 * @desc Function to get all the lists
 * @param req
 * @param res
 * @returns {object} result
 */
const loadAllLists = async (req, res) => {
  try {
    const sql = 'SELECT * FROM lists'
    const result = await db.executeQuery(sql)
    if (result.rowCount > 0) {
      res.status(200).json(result.rows)
    }
    res.status(200).json({ listCount: 0, message: 'No lists present' })
  } catch (err) {
    res.status(500).json(createError(500, 'Cannot fetch all the lists'))
  }
}

/**
 * @desc Function to update a list using the list_id
 * @param req
 * @param res
 */
const updateList = async (req, res) => {
  const { listName } = req.body
  const listId = parseInt(req.params.list_id)
  const sql = 'UPDATE lists SET list_name = $1 WHERE list_id = $2 RETURNING list_id, list_name'
  try {
    const result = await db.executeQuery(sql, [listName, listId])
    if (result.rowCount > 0) res.status(200).json(result.rows[0])
    else res.status(404).json(createError(404, 'List not found'))
  } catch (err) {
    res.status(500).json(createError(500, 'Could not update the list'))
  }
}

/**
 * @desc Function to delete a list using the list_id
 * @param req
 * @param res
 */
const deleteList = async (req, res) => {
  const listId = req.params.list_id
  const sql = 'DELETE FROM lists WHERE list_id = $1 RETURNING *'
  try {
    const result = await db.executeQuery(sql, [listId])
    if (result.rowCount > 0) res.status(200).json({ deleted: true })
    else res.status(404).json(createError(404, 'List not found'))
  } catch (err) {
    res.status(500).json(createError(500, 'Could not delete list'))
  }
}

module.exports = { createList, loadAllLists, updateList, deleteList }
