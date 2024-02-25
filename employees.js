// Load modules
require('dotenv').config();
const inquirer = require('inquirer');
const initDB   = require('./config/db');

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
					name:  'View all departments',
					value: 'deptList'
				},
				{
					name:  'View all roles',
					value: 'roleList'
				},
				{
					name:  'View all employees',
					value: 'employeeList'
				},
				{
					name:  'Add a department',
					value: 'deptAdd'
				},
				{
					name:  'Add a role',
					value: 'roleAdd'
				},
				{
					name:  'Add an employee',
					value: 'employeeAdd'
				},
				{
					name:  'Update an employee role',
					value: 'employeeUpdate'
				},
				{
					name:  'Quit',
					value: 'quit'
				}
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

	keys = {
		deptAdd:     ['deptAdd'],
		employeeAdd: ['empFirstName', 'empLastName', 'empRole', 'empManager'],
		roleAdd:     ['roleTitle', 'roleDept', 'roleSalary']
	};

	queries = {
		deptAdd: `INSERT INTO department (name)
                  VALUES (?)`,
		deptDelete: `DELETE
                     FROM department
                     WHERE id = ?`,
		deptList: `SELECT id, name
                   FROM department`,
		employeeAdd: `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`,
		employeeList: `SELECT id, title, salary, department_id
                       FROM role`,
		employeeUpdate: `UPDATE employee
                         SET first_name=?,
                             last_name=?,
                             role_id=?,
                             manager_id=?
                         WHERE id = ?`,
		roleAdd: `INSERT INTO role (title, salary, department_id)
                  VALUES (?, ?, ?)`,
		roleDelete: `DELETE
                     FROM department
                     WHERE id = ?`,
		roleList: `SELECT id, title, salary, department_id
                   FROM role`
	};

	constructor() {
		console.log('Employee Tracker');

		// Initialize the database connection
		(async () => {
			this.db = await initDB(inquirer, initDB);

			await this.mainmenu();
		})();

	}

	async deptDelete(id) {
		const query = this.doDB(this.queries.deptDelete, [id]);
	}

	// Adds an employee
	async doDB(sql, data = undefined) {
		try {
			return await this.db.execute(sql, data);
		} catch (error) {
			// Catch any errors and log them to the console.
			console.error(error);
		}
	}

	async doDBList(query) {
		// Send the request to the database.
		const [rows, fields] = await this.doDB(query);
		console.table(rows);

		// Call the constructor to load the main menu
		return;
	}

	// Updates an employee
	async employeeUpdate() {
		// "Update an employee role"
		const query = this.doDB(this.queries.employeeUpdate, [employee.empFirstName, employee.empLastName, employee.empRole, employee.empManager]);
	}

	// Asks the user questions
	async mainmenu() {
		let loop = true;
		// Prompt the user with the main menu
		do {
			// Update the prompts from the database, and then present the user with the main menu.
			// Then, handle the response.
			await this.promptsUpdate();
			const result = await this.promptUser(['options']);
			loop         = await this.menuHandler(result.options);
		} while (loop);

		process.exit(0);
	}

	async menuHandler(option) {
		switch (option) {
			case 'quit':
				return false;
			case 'deptList':        // List departments
			case 'employeeList':    // List employees
			case 'roleList':        // List roles
				await this.doDBList(await this.queries[option]);
				break;
			case 'deptAdd':     // Add a department
			case 'employeeAdd': // Add an employee
			case 'roleAdd':     // Add a role
				const result = await this.promptUser(this.keys[option]);
				await this.doDB(this.queries[option], this.keys.roleAdd.map(key => result[key]));
				// console.log(`${dept.addDept} successfully added to the department.`);
				// await this[option]();
				break;
			default:
				console.error(`ERROR: ${option} not implemented yet`);
		}
		return true;
	}

	async promptsUpdate(table) {
	}

	async promptUser(promptList) {
		// Return results
		return await inquirer.prompt(promptList.map(prompt => this.prompts[prompt]));
	}

	// Removes a role
	async roleDelete(id) {
		const query = this.doDB(this.queries.roleDelete, [id]);
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