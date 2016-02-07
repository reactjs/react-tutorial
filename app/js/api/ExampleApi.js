var HttpRequests = require('../utils/HttpRequests');

var ExampleApi = {
	postComments: function(dispatcher, comment) {
		HttpRequests.post(dispatcher, comment);
	},

	getComments: function(dispatcher) {
		HttpRequests.get(dispatcher);
	}
};

module.exports = ExampleApi;
