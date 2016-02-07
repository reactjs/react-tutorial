var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ExampleConstants = require('../constants/ExampleConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _comments = {};

var ExampleStore = assign({}, EventEmitter.prototype, {
	getAllComments: function() {
		return _comments;
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});

AppDispatcher.register(function(action) {
	switch(action.actionType) {
		case ExampleConstants.GET_COMMENTS:
		case ExampleConstants.POST_COMMENTS:
			_comments = action.comments;
			ExampleStore.emitChange();
			break;

		default:
			return;
	}
});

module.exports = ExampleStore;
