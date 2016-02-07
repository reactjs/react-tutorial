var http = require('http');
var ExampleConstants = require('../constants/ExampleConstants');

var apiOptions = function() {
	return {
		host: ExampleConstants.HOST,
		port: ExampleConstants.PORT,
		path: ExampleConstants.PATH
	};
};

var HttpRequests = {
	post: function(callback, data) {
		var options = apiOptions();
		options.method = 'POST';
		options.headers = {
			'Content-type': 'application/x-www-form-urlencoded',
			'Content-length': Buffer.byteLength(data)
		};

		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			var body = '';

			res.on('data', function(chunk) {
				body += chunk;
			});

			res.on('end', function() {
				callback(body);
			});
		});

		//author=A%20A%20Milne&text=Winnie+the+Pooh
		req.write(data);
		req.end();
	},

	get: function(callback) {
		var options = apiOptions();
		options.method = 'GET';
		options.headers = {
			'Content-type': 'application/json',
		};

		http.request(options, function(res) {
			res.setEncoding('utf8');
			var body = '';

			res.on('data', function(chunk) {
				body += chunk;
			});

			res.on('end', function() {
				callback(body);
			});
		}).end();
	}
};

module.exports = HttpRequests;
