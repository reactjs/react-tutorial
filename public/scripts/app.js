var CommentBox = React.createClass({
  render: function () {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
