class Player {
	constructor(username, forename, surname, password, rating, description) {
		this._username = username;
        this._forename = forename;
        this._surname = surname;
		this._password = password;
		this._rating = rating;
		this._description = description;
	}

	get username() {
		return this._username;
	}
	
    get forename() {
		return this._forename;
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
