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

    set forename(forename) {
        this._forename = forename;
    }

    set surname(surname) {
        this._surname = surname;
    }

    set password(password) {
        this._password = password;
    }

    set rating(rating) {
        this._rating = rating;
    }

    set description(description) {
        this._description = description;
    }
}

module.exports = Player;
