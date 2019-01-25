const Schema = require('validate');

const register = new Schema({
	username: {
		type: String,
		required: true,
		length: {min: 3, max: 20}
	},
    forename: {
		type: String,
		required: true,
		length: {max: 16}
    },
    surname: {
		type: String,
		required: true,
		length: {max: 16}
    },
	password: {
		type: String,
		required: true,
		length: {min: 5, max: 20},
    },
	rating: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: false,
		length: {max: 500}
	}
});

const login = new Schema({
	username: {
		type: String,
		required: true,
		length: {min: 3, max: 20}
	},
	password: {
		type: String,
		required: true,
		length: {min: 5, max: 20}
	}
});

const edit = new Schema({
    forename: {
		type: String,
		required: true,
		length: {max: 16}
    },
    surname: {
		type: String,
		required: true,
		length: {max: 16}
    },
	password: {
		type: String,
		required: true,
		length: {min: 5, max: 20},
    },
	rating: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: false,
		length: {max: 500}
	}
});

module.exports = {
    register: register,
    login: login,
    edit: edit
}
