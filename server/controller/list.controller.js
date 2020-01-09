/**
 * @desc Function to create a new list
 * @param req
 * @param res
 */
const createList = (req, res) => {
  res.send('Create a new list')
}

/**
 * @desc Function to get all the lists
 * @param req
 * @param res
 */
const loadAllLists = (req, res) => {
  res.send('Load all lists')
}

/**
 * @desc Function to update a list using the list_id
 * @param req
 * @param res
 */
const updateList = (req, res) => {
  res.send('Update list ' + req.params.list_id)
}

/**
 * @desc Function to delete a list using the list_id
 * @param req
 * @param res
 */
const deleteList = (req, res) => {
  res.send('Delete list ' + req.params.list_id)
}

module.exports = { createList, loadAllLists, updateList, deleteList }
