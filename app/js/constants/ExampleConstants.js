var keyMirror = require('react/lib/keyMirror');

module.exports = {
	Config: {
		HOST: 'localhost',
		PORT: 3001,
		API: '/api/comments',
	},

	ActionTypes: keyMirror({
		GET_COMMENTS: null,
		POST_COMMENTS: null
	}),

	Pages: keyMirror({
		HOME: null,
		NOT_FOUND: null
	})
};
