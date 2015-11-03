var CommentBox = React.createClass({
  render: function () {
    return (
      <div className="commentBox">
        <h1>Comments</h1>

        <div className="comment">
          <h2 className="commentAuthor">
            My Author
          </h2>
          <span>foo</span>
        </div>

        <form className="commentForm" onSubmit="">
          <input type="text" placeholder="Your name" ref="author" />
          <input type="text" placeholder="Say something..." ref="text" />
          <input type="submit" value="Post" />
        </form>
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
