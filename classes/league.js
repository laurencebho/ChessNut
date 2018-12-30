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
		this._games.unshift(game);
	}

	addPlayer(player) {
		this._players[player.name] = player;
	}

    recentGames() { //10 most recently added games
        let recent = [];
        let games = this._games;
        for (let i=0; i<Math.min(10, games.length); i++) {
            recent.push(games[i]);
        }
        return recent;
    }
	getGameHistory(player) {
		let hist = [];
		for (let i=0; i<this._games.length; i++) {
			let game = this._games[i];
			if (game.white == player.name || game.black == player.name) {
				hist.push(game);
			}
		}
		return hist;
	}

    formatGames(hist) {
        let formatted = [];
        for (let i=0; i<hist.length; i++) {
            let result = hist[i].result;
            formatted.push({
                date: hist[i].date,
                white: hist[i].white,
                black: hist[i].black,
                result: result[0] + ' - ' + result[1]
            });
        }
        return formatted;
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

    getScore(player) {
        let hist = this.getGameHistory(player);
        let earned = 0;
        let total = hist.length;
        for (let i=0; i<total; i++) {
            let game = hist[i];
            if (game.white == player.name) {
                earned += game.result[0];
            }
            else {
                earned += game.result[1];
            }
        }
        return [earned, total];
    }

    calculateLeaderboard() {
        let scores = [];
        for (let key in this._players) {
            let player = this._players[key];
            let score = this.getScore(player);
            scores.push({
                score: score,
                name: player.firstname + ' ' + player.surname,
                formattedScore: score[0] + ' / ' + score[1] 
            });
        }
        scores.sort(function(a, b) { //sort points earned from high to low
            return b.score[0] - a.score[0];
        });
        let rank = 1;
        for (let key in scores) {
            scores[key].rank = rank;
            rank++;
        }
        return scores;
    }
    
    getMatchup(player, opponent) {
        let earned = 0;
        let conceded = 0;
        let games = this._games;
        for (let i-0; i<games.length; i++) {
            if (games[i].white == player) {
                if (games[i].black == opponent) {
                    games[i].result
                }
            }
        }
    }
	
}

module.exports = League;
