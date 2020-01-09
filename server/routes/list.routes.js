const express = require('express')
const router = express.Router()
const listController = require('../controller/list.controller')

/**
 * @desc To create a new list
 * @route POST /api/v1.0/list/
 */
router.post('/', listController.createList)

/**
 * @desc To get all lists
 * @route GET /api/v1.0/list/
 */
router.get('/', listController.loadAllLists)

/**
 * @desc To update a given list
 * @route PUT /api/v1.0/list/:list_id
 */
router.put('/:list_id', listController.updateList)

/**
 * @desc To delete a list
 * @route DELETE /api/v1.0/list/:list_id
 */
router.delete('/:list_id', listController.deleteList)

module.exports = router
