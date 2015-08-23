var React = require('react');
var CommentBox = require('./CommentBox.jsx');
var CommentForm = require('./CommentForm.jsx');
var CommentList = require('./CommentList.jsx');

React.render(
  <CommentBox url="comments.json" pollInterval={2000} />,
  document.getElementById('content')
);
