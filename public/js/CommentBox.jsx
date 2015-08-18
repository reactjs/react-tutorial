'use strict';

var CommentList = require('./CommentList.jsx');
var CommentForm = require('./CommentForm.jsx');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});
