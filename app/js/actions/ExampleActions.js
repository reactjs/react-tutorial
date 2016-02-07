var AppDispatcher = require('../dispatcher/AppDispatcher');
var ExampleConstants = require('../constants/ExampleConstants');
var ExampleApi = require('../api/ExampleApi');

var ExampleActions = {
	postComment: function(comment) {
		var dispatcher = function(comments) {
			AddDispatcher.dispatch({
				actionType: ExampleConstants.POST_COMMENTS,
				comments: comments
			});
		};

		ExampleApi.postComment(dispatcher, comment);
	},

	getCommments: function() {
		var dispatcher = function(comments) {
			AddDispatcher.dispatch({
				actionType: ExampleConstants.GET_COMMENTS,
				comments: comments
			});
		};

		ExampleApi.getComments(dispatcher);
	}
};

module.exports = ExampleActions;
