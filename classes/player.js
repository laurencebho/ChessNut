class Player {
	constructor(name, firstname, surname, password, rating, description) {
		this._name = name;
        this._firstname = firstname;
        this._surname = surname;
		this._password = password;
		this._rating = rating;
		this._description = description;
	}

	get name() {
		return this._name;
	}
	
    get firstname() {
		return this._firstname;
	}
	
    get surname() {
		return this._surname;
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
