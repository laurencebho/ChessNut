const Player = require("./player.js");

class League {
	constructor() {
		this._games = [];
		this._players = {};
        this._leagueStatus = "";
	}

	get games() {
		return this._games;
	}

	get players() {
		return this._players;
	}

    get leagueStatus() {
        return this._leagueStatus;
    }

    set leagueStatus(leagueStatus) {
        this._leagueStatus = leagueStatus;
    }

	addGame(game) {
		this._games.unshift(game);
	}

	addPlayer(player) {
		this._players[player.username] = player;
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
			if (game.white == player.username || game.black == player.username) {
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
	validate(username, password) {
		let player = this._players[username];
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
            if (game.white == player.username) {
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
                username: player.username,
                score: score,
                forename: player.forename,
                surname: player.surname,
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
        for (let i=0; i<games.length; i++) {
            if (games[i].white == player) {
                if (games[i].black == opponent) {
                    let result = games[i].result;
                    earned += result[0];
                    conceded += result[1];
                }
            }
            else if (games[i].black == player) {
                if (games[i].white == opponent) {
                    let result = games[i].result;
                    earned += result[1];
                    conceded += result[0];
                }
            }
        }
        return earned + " - " + conceded;
    }
    
    addDefaultPlayers() {
        this.addPlayer(new Player(
            "doctorwhocomposer",
            "Delia",
            "Derbyshire",
            "guest",
            1200,
            "The composer of the Doctor Who theme."
        ));
    }	
}

module.exports = League;
