var React = require('react');
var CommentList = require('./CommentList.react');
var CommentForm = require('./CommentForm.react');
var ExampleStore = require('../stores/ExampleStore');
var ExampleActions = require('../actions/ExampleActions');

function getExampleState() {
	return {
		data: ExampleStore.getAllComments()
	};
}

var CommentBox = React.createClass({
	handleCommentSubmit: function(comment) {
		var comments = this.state.data;

		comment.id = Date.now();
		var newComments = comments.concat([comment]);
		this.setState({data: newComments});

		ExampleActions.postComment(comment);
	},
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.setState(getExampleState());
	},
	render: function() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data} />
				<CommentForm onCommentSubmit={this.handleCommentSubmit} />
			</div>
		);
	}
});

module.exports = CommentBox;
