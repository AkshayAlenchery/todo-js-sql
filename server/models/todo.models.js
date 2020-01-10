const { Pool } = require('pg')

const pool = new Pool()

/**
 * Execute a query
 * @param sql
 * @param params
 * @returns res
 */
const executeQuery = async (sql, params) => {
  try {
    return await pool.query(sql, params)
  } catch (err) {
    console.log(err)
  }
}

module.exports = { executeQuery }
