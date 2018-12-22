class Tournament {
	constructor(name) {
		this._size = 8;
		this._name = name;
		this._players = [];
	}

	function addPlayer(player) {
		if (this.size == this._players.length) throw "tournament full";
		duplicate = false;
		for (let i=0; i<this._players.length; i++) {
			if (this._players[i].name == player.name) {
				duplicate = true;
				break;
			}
		}
		if (!duplicate) {
			this._players.push(player);
		}
		throw "this player is already in the tournament";
	}

	get size() {
		return this._size;
	}
}