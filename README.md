# w12-Employee-Tracker

Week 12 - Employee Tracker

## Description

The Employee Tracker is a command-line application designed to help business owners manage their company's departments,
roles, and employees. By providing a user-friendly interface, the app allows the user to view all departments, roles,
and employees. It also supports adding, deleting and updating those same tables.

## Installation

To install the Employee Tracker, you'll need to clone the repository to your local environment and then run npm install
to install all necessary dependencies. Beyond that, you'll also want to make sure that you do have MySQL (or MariaDB)
installed, and that you have write access to a database. You can find a schema.sql file that can be run to build the 
database for you, in the `db` folder. The database is named `dieArbeit` (*the work* in German), but can be named 
something else more fitting for your purposes.

Use the following command to clone the repository:

```shell
git clone <repository_url>
```
Then move into the cloned directory and install the dependencies:

```shell
cd <repository_name>
npm install
```
## Usage

### Execution

To run the Employee Tracker application, use the following command in your terminal:

```shell
npm start
```

### Demonstration

A video demonstration of the application can be found here: 

### Future Plans

Future versions of this application should include additional checks on data inputs, better formatting and functions 
to improve the workflow.

## User Story

```text
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```text
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
```