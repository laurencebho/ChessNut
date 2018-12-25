class Player {
	constructor(name, password, rating, description) {
		this._name = name;
		this._password = password;
		this._rating = rating;
		this._description = description;
	}

	get name() {
		return this._name;
	}

	get password() {
		return this._password;
	}

	get rating() {
		return this._rating;
	}

	get description() {
		return this._description;
	}
}

module.exports = Player;
