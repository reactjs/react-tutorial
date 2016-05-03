var Comment = React.createClass({
  rawMarkup: function () {
    var rawMarkup = marked(this.props.children.toString(), { sanitize: true });
    return { __html: rawMarkup };
  },

  render: function () {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.data.map(function (comment, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Comment author={comment.author} key={index}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentBox = React.createClass({
  getInitialState: function () {
    return {
      data: [
        {
          "author": "Pete Hunt",
          "text": "Hey there!"
        },
        {
          "author": "Paul O’Shannessy",
          "text": "React is *great*!"
        }
      ]
    };
  },
  render: function () {
    return (
      <div className="commentBox">
        <h1>Comments</h1>

        <CommentList data={this.state.data} />

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
