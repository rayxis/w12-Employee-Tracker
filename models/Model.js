const { capitalize } = require('../utils/utils');

class Model {
	data = {};
	main = undefined;

	constructor(main) {
		// Save the main class reference and data.
		this.main = main;
		this.data = main.data;
	}

	// Adds an entry to the database
	async add() {
		// Ask the user questions to add an entry to the database.
		const result = await this.promptGet('add');
		await this.main.doDB(this.func.add.query, this.func.add.keys.map(key => result[key]));
		// Sync the data
		await this.sync();

		// Let the user know that the entry was added.
		console.log(`${capitalize(this.table)} added successfully`);
	}

	async delete() {
		// Ask the user which item to delete, and delete it.
		const result = await this.promptGet('delete');
		await this.main.doDB(this.func.delete.query, [result.delete]);
		// Sync the data
		await this.sync();

		// Let the user know that the entry was deleted.
		console.log(`${capitalize(this.table)} deleted successfully`);
	}

	// List database entries and show a table
	async list() {
		await this.main.doDBList(this.func.list.query);
	}

	// Update the row data from the database
	async promptGet(funcName, cbPreCall = undefined) {
		// Load the specified function prompts
		let prompt = this.func[funcName].keys.map(key => this.prompts[key]);
		// If there is a callback function specified, send the prompt data back and then reassign any changes.
		if (typeof cbPreCall === 'function') prompt = cbPreCall(prompt);
		// Ask the user questions and return the results.
		return await this.main.promptUser(prompt);
	}

	// Sync data from the database to the data array
	async sync() {
		// Clear the data array
		this.data[this.table].length = 0;
		// Pull data from the database
		const [rows, fields]         = await this.main.doDB(this.func.list.query);
		// Loop through each returned row
		rows.forEach(row => {
			// For the purposes of inquirer, name and value are required fields to make this work.
			// If name is specified, use that; otherwise use the title (if that exists) otherwise fallback to
			// first_name and last_name.
			row.name  = row.name ? row.name :
			            row.title ? row.title :
			            `${row.first_name} ${row.last_name}`;
			// Set the value to the row ID
			row.value = row.id;

			// Save the row in the data array
			this.data[this.table].push(row);
		});
	}

	// Updates data to the database
	async update() {
		// Ask the user which item to update.
		const {update: itemID} = await this.promptGet('updateSelect');

		// Loop through and update the defaults for the properties.
		const dbItem = this.data[this.table].find(item => item.id === itemID);

		// Prompt the user with update questions.
		const result = await this.promptGet('update', prompt => {
			// Remap the questions with default values.
			return prompt.map(item => ({
				...item,
				default: dbItem[item.name]
			}));
		});

		// Set the row ID
		result.id = itemID;

		// Get the values from the prompt return object, and pass them to the database; then sync.
		await this.main.doDB(this.func.update.query, Object.values(result));
		await this.sync();

		// Let the user know that the entry was updated.
		console.log(`${capitalize(this.table)} updated successfully`);
	}
}

module.exports = Model;