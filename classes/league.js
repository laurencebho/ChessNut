class League {
	constructor() {
		this._games = []
		this._players = {}
	}

	get games() {
		return this._games;
	}

	get players() {
		return this._players;
	}

	addGame(game) {
		this._games.push(game);
	}

	addPlayer(player) {
		this._players[player.name] = player;
	}

	getGameHistory(player) {
		let hist = [];
		for (let i=0; i<this._games.length; i++) {
			let game = games[i];
			if (game.players.includes(player.name)) {
				hist.push(game);
			}
		}
		return hist;
	}

	validate(name, password) {
		let player = this._players[name];
		if (player) {
			if (player.password == password) {
				return true;
			}
		}
		return false;
	}
	
}

module.exports = League;