// Load modules
require('dotenv').config();
const inquirer = require('inquirer');
const initDB   = require('./config/db');

class employeeTracker {
	data    = {
		department: [],
		employee:   [],
		role:       []
	};
	prompts = {
		deptAdd:      {
			type:    'input',
			name:    'addDept',
			message: `Department you\'d like to add:`
		},
		deptDelete:   {
			type:    'list',
			name:    'deleteDept',
			message: `Delete which department:`,
			choices: this.data.department
		},
		empDelete:    {
			type:    'list',
			name:    'deleteEmp',
			message: `Delete which employee:`,
			choices: this.data.employee
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
			type:    'list',
			name:    'empRole',
			message: `Role:`,
			choices: this.data.role
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
		roleDelete:    {
 			type:    'list',
			name:    'deleteRole',
			message: `Delete which role:`,
			choices: this.data.role
		},
		roleDept:     {
			type:    'list',
			name:    'roleDept',
			message: `Add role to which department:`,
			choices: this.data.department
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
		deptAdd:        ['deptAdd'],
		deptDelete:     ['deptDelete'],
		employeeAdd:    ['empFirstName', 'empLastName', 'empRole', 'empManager'],
		employeeDelete: ['empDelete'],
		roleAdd:        ['roleTitle', 'roleDept', 'roleSalary'],
		roleDelete:     ['roleDelete']
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
		roleAdd: `INSERT INTO role (title, department_id, salary)
		          VALUES (?, ?, ?)`,
		roleDelete: `DELETE
		             FROM department
		             WHERE id = ?`,
		roleList: `SELECT role.id, role.title, role.salary, department.name AS department_name
		           FROM role
		                INNER JOIN department
		                ON role.department_id = department.id`
	};

	constructor() {
		console.log('Employee Tracker');

		// Initialize the database connection
		(async () => {
			this.db = await initDB(inquirer, initDB);

			await this.mainmenu();
		})();

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
		let result;

		switch (option) {
			case 'quit':
				return false;
			case 'deptAdd':     // Add a department
			case 'employeeAdd': // Add an employee
			case 'roleAdd':     // Add a role
				result = await this.promptUser(this.keys[option]);
				await this.doDB(this.queries[option], this.keys.roleAdd.map(key => result[key]));
				// console.log(` successfully added to `);
				// await this[option]();
				break;
			case 'deptDelete':     // Delete a department
			case 'employeeDelete': // Delete an employee
			case 'roleDelete':     // Delete a role
				result = await this.promptUser(this.keys[option]);
				await this.doDB(this.queries[option]);
				break;
			case 'deptList':        // List departments
			case 'employeeList':    // List employees
			case 'roleList':        // List roles
				await this.doDBList(await this.queries[option]);
				break;
			case 'employeeUpdate':  // Update an employee
				break;
			default:
				console.error(`ERROR: ${option} not implemented yet`);
		}
		return true;
	}

	async promptsUpdate(table) {
		const tableMap = {
			deptList:     'department',
			employeeList: 'employee',
			roleList:     'role'
		};

		// Loop through the table map
		for (const [func, table] of Object.entries(tableMap)) {
			// Clear the array
			this.data[table].length = 0;
			// Fetch the database entries and then push the rows. Inquirer only accepts value, not id.
			const [rows, fields]    = await this.doDB(this.queries[func]);
			rows.forEach(row => this.data[table].push({...row, value: row.id}));
		}
	}

	async promptUser(promptList) {
		// Return results
		return await inquirer.prompt(promptList.map(prompt => this.prompts[prompt]));
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