var CommentBox = require('./example.js').CommentBox;

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
