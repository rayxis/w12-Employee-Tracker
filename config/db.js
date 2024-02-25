// Load modules
require('dotenv').config();
const mysql = require('mysql2/promise');

let db;
// Create a MySQL connection.
(async () => await mysql.createConnection({
	                                          host:              process.env.DB_HOST,
	                                          user:              process.env.DB_USER,
	                                          password:          process.env.DB_PASS,
	                                          database:          process.env.DB_NAME,
	                                          namedPlaceholders: true
                                          })
		// Save the connection handler
		                .then(connection => db = connection)
		// Catch any errors and report them to the console
		                .catch(err => console.log(err))
)();

// Export the mysql connection
module.exports = db;