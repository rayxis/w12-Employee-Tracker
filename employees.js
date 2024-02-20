// Load modules
const inquirer = require('inquirer');
const mysql    = require('mysql2');

prompts = {
	deptAdd: {
		type:    'input',
		name:    'addDept',
		message: `Department you\'d like to add:`
	},
	empFirstName: {
		type:    'input',
		name:    'empFirstName',
		message: `First name:`
	},
	empLastName: {
		type:    'input',
		name:    'empLastName',
		message: `Last name:`
	},
	empManager: {
		type:    'input',
		name:    'empManager',
		message: `Employee Manager:`
	},
	empRole: {
		type:    'input',
		name:    'empRole',
		message: `Role:`
	},
	options: {
		type:    'list',
		name:    'options',
		message: 'Add an element:',
		choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
	},
	roleDept: {
		type:    'input',
		name:    'roleDept',
		message: `Add role to which department:`
	},
	roleSalary: {
		type:    'input',
		name:    'roleSalary',
		message: `Salary for the role:`
	},
	roleTitle: {
		type:    'input',
		name:    'roleTitle',
		message: `Role you\'d like to add:`
	},
};
