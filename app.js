// Load modules
require('dotenv').config();
const inquirer   = require('inquirer');
const initDB     = require('./config/db');
const Department = require('./models/Department');
const Role       = require('./models/Role');
const Employee   = require('./models/Employee');

class employeeTracker {
	// Central data storage
	data   = {
		department: [],
		employee:   [],
		role:       []
	};

	// Models
	models = {
		department: undefined,
		employee:   undefined,
		role:       undefined
	};

	// Main Menu
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
			// Initialize the database connection
			this.db = await initDB(inquirer, initDB);

			// Load the data models
			this.models.department = new Department(this);
			this.models.employee   = new Employee(this);
			this.models.role       = new Role(this);

			// Sync the model data from the database, and then load the menu.
			await this.sync();
			await this.menu();
		})();
	}

	async menu() {
		let loop = true;

		do {
			// Prompt the user with the main menu
			const result = await this.promptUser(this.menuPrompt);

			// If the user selected Quit, stop the loop
			if (result.selected !== 'quit') {
				// Split the value (action:model), and then call the action function from the specified model.
				const [action, model] = result.selected.split(':');
				await this.models[model][action]();

			} else loop = false;
			// Loop the menu until the user chooses to exit.
		} while (loop);

		// Exit
		process.exit(0);
	}

	// Prompt the user with specified questions
	async promptUser(prompts) {
		return await inquirer.prompt(prompts);
	}

	// Execute database queries
	async doDB(query, data = undefined) {
		try {
			// Return the result from the database query
			return await this.db.execute(query, data);
		} catch (error) {
			// Catch any errors and log them to the console.
			console.error(error);
		}
	}

	// Execute database queries and display as a table
	async doDBList(query, where = undefined) {
		if (where !== undefined) query += ` WHERE id = ?`;
		// Send the request to the database.
		const [rows, fields] = await this.doDB(query);
		console.table(rows);

		// Call the constructor to load the main menu
		return;
	}

	// Function to stop the database connection
	async stop() {
		// If the database is specified, end the connection.
		if (this.db) await this.db.end();
	}

	// Sync database data from each model
	async sync() {
		await this.models.department.sync();
		await this.models.role.sync();
		await this.models.employee.sync();
	}
}

// Self-execute the class
const emp = new employeeTracker();

// When the user presses CTRL+C, exit the application gracefully.
process.on('SIGINT', async () => {
	console.log('\nExiting on SIGINT (Ctrl+C)...');
	process.exit();
});

// Close the database connection when the application exits.
process.once('exit', async (code) => {
	await emp.stop();
	console.log('\nExited');
});