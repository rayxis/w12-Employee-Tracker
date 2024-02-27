// Load the Model class
const Model = require('./Model');

class Employee extends Model {
	table   = 'employee';
	// Prompts
	prompts = {
		delete:    {
			type:    'list',
			name:    'delete',
			message: `Delete which employee:`,
			choices: this.data.employee
		},
		first_name: {
			type:    'input',
			name:    'first_name',
			message: `First name:`
		},
		last_name:  {
			type:    'input',
			name:    'last_name',
			message: `Last name:`
		},
		manager:   {
			type:    'list',
			name:    'manager',
			message: `Employee Manager:`,
			choices: this.data.employee
		},
		role:      {
			type:    'list',
			name:    'role',
			message: `Role:`,
			choices: this.data.role
		},
		update:    {
			type:    'list',
			name:    'update',
			message: `Update which employee:`,
			choices: this.data.employee
		}
	};

	// Functional References
	func = {
		add:          {
			keys: ['first_name', 'last_name', 'role', 'manager'],
			query: `INSERT INTO employee (first_name, last_name, role_id, manager_id)
			        VALUES (?, ?, ?, ?)`
		},
		delete:       {
			keys: ['delete'],
			query: `DELETE
			        FROM employee
			        WHERE id = ?`
		},
		list:         {
			query: `SELECT emp.id,
			               emp.first_name,
			               emp.last_name,
			               role.title                                         AS role,
			               department.name                                    AS department,
			               role.salary                                        AS salary,
			               CONCAT(manager.first_name, ' ', manager.last_name) AS manager
			        FROM employee AS emp
			             INNER JOIN
			             role ON emp.role_id = role.id
			             INNER JOIN
			             department ON role.department_id = department.id
			             LEFT JOIN
			             employee AS manager ON emp.manager_id = manager.id;`
		},
		update:       {
			keys: ['first_name', 'last_name', 'role', 'manager'],
			query: `UPDATE employee
			        SET first_name = ?,
			            last_name  = ?,
			            role_id    = ?,
			            manager_id = ?
			        WHERE id = ?`
		},
		updateSelect: {
			keys: ['update'],
			query: `SELECT *
			        FROM employee
			        WHERE id = ?`
		}
	};

	async sync() {
		super.sync();
		this.data[this.table].push({name: '(None)', value: null});
	}
}

module.exports = Employee;