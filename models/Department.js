// Load the Model class
const Model = require('./Model');

class Department extends Model {
	table = 'department';
	// Prompts
	prompts = {
		add:    {
			type:    'input',
			name:    'add',
			message: `Department name:`
		},
		delete: {
			type:    'list',
			name:    'delete',
			message: `Delete which department:`,
			choices: this.data.department
		},
		update:    {
			type:    'list',
			name:    'update',
			message: `Update which department:`,
			choices: this.data.department
		}
	};

	// Functional References
	func = {
		add:    {
			keys: ['add'],
			query: `INSERT INTO department (name)
			        VALUES (?)`
		},
		delete: {
			keys: ['delete'],
			query: `DELETE
			        FROM department
			        WHERE id = ?`
		},
		list:   {
			query: `SELECT id, name
			        FROM department`
		},
		update: {
			keys: ['add'],
			query: `UPDATE department
			        SET name = ?
			        WHERE id = ?`
		},
		updateSelect: {
			keys: ['update'],
			query: `SELECT *
			        FROM department
			        WHERE id = ?`
		}
	};
}

module.exports = Department;