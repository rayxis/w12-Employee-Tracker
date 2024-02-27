// Load modules
require('dotenv').config();
const inquirer   = require('inquirer');
const initDB     = require('./config/db');
const Department = require('./models/Department');
const Role       = require('./models/Role');
const Employee   = require('./models/Employee');

class employeeTracker {
	data   = {
		defaults:   [],
		department: [],
		employee:   [],
		role:       []
	};
	models = {
		department: undefined,
		employee:   undefined,
		role:       undefined
	};

	menuPrompt = {
		type:    'list',
		name:    'selected',
		message: 'Select an option:',
		choices: [
			{
				name:  'View all departments',
				value: 'list:department'
			},
			{
				name:  'View all roles',
				value: 'list:role'
			},
			{
				name:  'View all employees',
				value: 'list:employee'
			},
			{
				name:  'Add a department',
				value: 'add:department'
			},
			{
				name:  'Add a role',
				value: 'add:role'
			},
			{
				name:  'Add an employee',
				value: 'add:employee'
			},
			{
				name:  'Delete a department',
				value: 'delete:department'
			},
			{
				name:  'Delete a role',
				value: 'delete:role'
			},
			{
				name:  'Delete an employee',
				value: 'delete:employee'
			},
			{
				name:  'Update a department',
				value: 'update:department'
			},
			{
				name:  'Update an employee',
				value: 'update:employee'
			},
			{
				name:  'Update a role',
				value: 'update:role'
			},
			{
				name:  'Quit',
				value: 'quit'
			}
		]
	};

	constructor() {
		console.log('Employee Tracker');

		// Initialize the database connection
		(async () => {
			this.db = await initDB(inquirer, initDB);

			this.models.department = new Department(this);
			this.models.employee   = new Employee(this);
			this.models.role       = new Role(this);

			await this.sync();

			this.menu();
		})();
	}

	async menu() {
		let loop = true;
		// Prompt the user with the main menu
		do {
			const result = await this.promptUser(this.menuPrompt);

			if (result.selected === 'quit') loop = false;
			else {
				const [action, model] = result.selected.split(':');
				await this.models[model][action]();
			}
		} while (loop);

		// Exit
		process.exit(0);
	}

	async promptUser(prompts) {
		return await inquirer.prompt(prompts);
	}

	async doDB(query, data = undefined) {
		try {
			return await this.db.execute(query, data);
		} catch (error) {
			// Catch any errors and log them to the console.
			console.error(error);
		}
	}

	async doDBList(query, where = undefined) {
		if (where !== undefined) query += ` WHERE id = ?`;
		// Send the request to the database.
		const [rows, fields] = await this.doDB(query);
		console.table(rows);

		// Call the constructor to load the main menu
		return;
	}

	async stop() {
		if (this.db) await this.db.end();
	}

	// Sync database data
	async sync() {
		await this.models.department.sync();
		await this.models.role.sync();
		await this.models.employee.sync();
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