class Model {
	data   = {};
	main   = undefined;
	// Models
	models = {};

	constructor(main) {
		// Save the main class reference.
		this.main = main;
		this.data = main.data;
		// Load models
		// this.models = main.models;
	}

	async add() {
		// Ask the user questions to add an entry to the database.
		const prompts = await this.promptGet('add');
		await this.main.doDB(this.func.add.query, this.func.add.keys.map(key => result[key]));
		await this.sync();

		// Let the user know that the entry was added.
		console.log(`${this.capitalize(this.table)} added successfully`);
	}

	async delete() {
		// Ask the user which item to delete.
		const prompts = await this.promptGet('delete');
		this.main.doDB(this.func.delete.query, [result.delete]);
		await this.sync();

		// Let the user know that the entry was deleted.
		console.log(`${this.capitalize(this.table)} deleted successfully`);
	}

	async list() {
		await this.main.doDBList(this.func.list.query);
	}

	// Update the row data from the database
	async sync() {
		this.data[this.table].length = 0;
		const [rows, fields]         = await this.main.doDB(this.func.list.query);
		rows.forEach(row => {
			row.name  = row.name ? row.name :
			            row.title ? row.title :
			            `${row.first_name} ${row.last_name}`;
			row.value = row.id;
			this.data[this.table].push(row);
		});
	}

	async update() {
		// Ask the user which item to update.
		const {update: itemID} = await this.promptGet('updateSelect');

		// Loop through and update the defaults for the properties.
		const dbItem = this.data[this.table].find(item => item.id === itemID);

		// Prompt the user with update questions.
		const result = await this.promptGet('update', prompt => {
			return prompt.map(item => ({
				...item,
				default: dbItem[item.name]
			}))
		});

		result.id = itemID;

		await this.main.doDB(this.func.update.query, Object.values(result));
		await this.sync();

		// Let the user know that the entry was updated.
		console.log(`${this.capitalize(this.table)} updated successfully`);
	}

	capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	// TODO: Maybe addNull?
	async promptGet(funcName, cbPreCall = undefined) {
		let prompt = this.func[funcName].keys.map(key => this.prompts[key]);
		if (typeof cbPreCall === 'function') prompt = cbPreCall(prompt);
		return await this.main.promptUser(prompt);
	}
}

module.exports = Model;