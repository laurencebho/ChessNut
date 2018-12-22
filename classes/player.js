export class Player {
	constructor(name, rating, description) {
		this._name = name;
		this._rating = rating;
		this._description = description;
		this._record = new Record();
	}

	get name() {
		return this._name;
	}

	get rating() {
		return this._rating;
	}

	get description() {
		return this._description;
	}

	get record() {
		return this._record.getTotal();
	}
}

class Record {
	constructor() {
		this._wins = 0;
		this._losses = 0;
		this._draws = 0;
	}

	function incWins() {
		this._wins += 1;
	}

	function incLosses() {
		this._losses += 1;
	}

	function incDraws() {
		this._draws += 1;
	}

	function getTotal() {
		return {
			wins: this._wins,
			losses: this._losses
			draws: this._draws
		}
	}
}
