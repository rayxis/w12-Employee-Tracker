// Load modules
const inquirer = require('inquirer');
const mysql    = require('mysql2');

prompts = {
	options:   {
		type:    'list',
		name:    'options',
		message: 'Add an element:',
		choices: ['View all departments','View all roles','View all employees','Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
	},
};

