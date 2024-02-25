// Load modules
require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a MySQL connection, and save the promise.
async function initDB() {
	try {
		const db = await mysql.createConnection({
			                                  host:              process.env.DB_HOST,
			                                  user:              process.env.DB_USER,
			                                  password:          process.env.DB_PASS,
			                                  database:          process.env.DB_NAME,
			                                  namedPlaceholders: true
		                                  });
		return db;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Export the mysql connection
module.exports = initDB;