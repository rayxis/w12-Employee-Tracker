// Load the Model class
const Model = require('./Model');

class Role extends Model {
	table = 'role';
	// Prompts
	prompts = {
		delete: {
			type:    'list',
			name:    'delete',
			message: `Delete which role:`,
			choices: this.data.role
		},
		dept:   {
			type:    'list',
			name:    'dept',
			message: `Which department:`,
			choices: this.data.department
		},
		salary: {
			type:    'input',
			name:    'salary',
			message: `Salary for the role:`
		},
		title:  {
			type:    'input',
			name:    'title',
			message: `Role name:`
		},
		update:    {
			type:    'list',
			name:    'update',
			message: `Update which role:`,
			choices: this.data.role
		}
	};

	// Functional References
	func =    {
		add:    {
			keys: ['title', 'dept', 'salary'],
			query: `INSERT INTO role (title, department_id, salary)
				        VALUES (?, ?, ?)`
		},
		delete: {
			keys: ['delete'],
			query: `DELETE
				        FROM department
				        WHERE id = ?`
		},
		list:   {
			query: `SELECT role.id,
				               role.title,
				               role.salary,
				               department.name AS department_name
				        FROM role
				             INNER JOIN department
				             ON role.department_id = department.id`
		},
		update: {
			keys: ['title', 'dept', 'salary'],
			query: `UPDATE role
				        SET title=?,
				            department_id=?,
				            salary=?
				        WHERE id = ?`
		},
		updateSelect: {
			keys: ['update'],
			query: `SELECT *
			        FROM role
			        WHERE id = ?`
		}
	}
}

module.exports = Role;