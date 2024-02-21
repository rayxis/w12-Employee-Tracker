// Load modules
require('dotenv').config();
const inquirer = require('inquirer');
const mysql    = require('mysql2/promise');

class employeeTracker {
	prompts = {
		deptAdd:      {
			type:    'input',
			name:    'addDept',
			message: `Department you\'d like to add:`
		},
		empFirstName: {
			type:    'input',
			name:    'empFirstName',
			message: `First name:`
		},
		empLastName:  {
			type:    'input',
			name:    'empLastName',
			message: `Last name:`
		},
		empManager:   {
			type:    'input',
			name:    'empManager',
			message: `Employee Manager:`
		},
		empRole:      {
			type:    'input',
			name:    'empRole',
			message: `Role:`
		},
		options:      {
			type:    'list',
			name:    'options',
			message: 'Select an option:',
			choices: [
				{
					name: 'View all departments',
					value: 'deptList',
				},
				{
					name: 'View all roles',
					value: 'roleList',
				},
				{
					name: 'View all employees',
					value: 'employeeList',
				},
				{
					name: 'Add a department',
					value: 'deptAdd',
				},
				{
					name: 'Add a role',
					value: 'roleAdd',
				},
				{
					name: 'Add an employee',
					value: 'employeeAdd',
				},
				{
					name: 'Update an employee role',
					value: 'employeeUpdate',
				},
				{
					name: 'Quit',
					value: 'quit',
				},
			]
		},
		roleDept:     {
			type:    'input',
			name:    'roleDept',
			message: `Add role to which department:`
		},
		roleSalary:   {
			type:    'input',
			name:    'roleSalary',
			message: `Salary for the role:`
		},
		roleTitle:    {
			type:    'input',
			name:    'roleTitle',
			message: `Role you\'d like to add:`
		}
	};

	constructor() {
		console.log('Employee Tracker');

		// Create a MySQL connection
		mysql.createConnection({
			                                 host:              process.env.DB_HOST,
			                                 user:              process.env.DB_USER,
			                                 password:          process.env.DB_PASS,
			                                 database:          process.env.DB_NAME,
			                                 namedPlaceholders: true
		                                 })
		     // Save the connection handle
		     .then(connection => {
				 this.db = connection;
		     })
			// Catch any errors
			           .catch((err) => console.error(err));

		this.promptUser(['options']).then(result => {
			if (result.options === 'quit') process.exit();
		});
	}

	// Add a department
	async deptAdd() {
		const dept = await this.promptUser(['deptAdd']);
		const sql  = `INSERT INTO department (name)
                      VALUES (:name)`;

		this.db.execute(sql, [dept])
		    .then(result => console.log('Successfully added.'))
			// Catch any errors
			.catch((err) => console.error(err));
	}

	// List departments
	async deptList() {
		const query = this.db.format(`SELECT id, name
                                      FROM department;`);
	}

	async deptDelete(id) {
		const query = this.db.format(`DELETE
                                      FROM department
                                      WHERE id = ?`, [id]);
	}

	async doDB(query) {
		return await this.db.query(query, (err, result) => {});

	}

	// Adds an employee
	async employeeAdd() {
		const employee = await this.promptUser(['empFirstName', 'empLastName', 'empRole', 'empManager']);

		// "Add an employee"
		const query = mysql.format(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?,
                                            ?)`, [employee.empFirstName, employee.empLastName, employee.empRole, employee.empManager]);
	}

	// Lists employees
	async employeeList(filter = undefined) {
		// "View all employees"
		const query = this.db.format(`SELECT id, title, salary, department_id
                                      FROM role;`);
	}

	// Updates an employee
	async employeeUpdate() {
		// "Update an employee role"
		const query = this.db.format(`UPDATE employee
                                      SET first_name=?,
                                          last_name=?,
                                          role_id=?,
                                          manager_id=?
                                      WHERE id = ?;`, [employee.empFirstName, employee.empLastName, employee.empRole, employee.empManager]);
	}

	// Asks the user questions
	async promptUser(promptList) {
		// Return results
		return await inquirer.prompt(promptList.map(prompt => this.prompts[prompt]));
	}

	// Adds a role
	async roleAdd() {
		const role = await this.promptUser(['roleTitle', 'roleDept', 'roleSalary']);

		// "Add a role"
		const query = this.db.format(`INSERT INTO role (title, salary, department_id)
                                      VALUES (?, ?, ?)`, [role.roleTitle, role.roleDept, role.roleSalary]);

	}

	// Lists roles
	async roleList() {
		// "View all roles"
		const query = this.db.format(`SELECT id, title, salary, department_id
                                      FROM role;`);
	}

	// Removes a role
	async roleRemove(id) {
		const query = this.db.format(`DELETE
                                      FROM department
                                      WHERE id = ?`, [id]);


	}

	async stop() {
		if (this.db) await this.db.end();
	}
}

const emp = new employeeTracker();

// When the user presses CTRL+C
process.on('SIGINT', async () => {
	console.log('\nExiting on SIGINT (Ctrl+C)...');
	process.exit();
});

process.once('exit', async (code) => {
	console.log('\nExited');
	await emp.stop();
});