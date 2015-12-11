class CommentModel {
    constructor(id, author, text) {
        this.id = id;
        this.author = author;
        this.text = text;
    }
}

const dummyData = [
    new CommentModel(0, 'Adrian-Tudor Panescu', 'Hello World!'),
    new CommentModel(1, 'John Doe', 'Heh.')
];

const contentDOM = document.getElementById('content');

const Comment = React.createClass({
    // don't use arrow functions if you plan to use this:
    // https://github.com/facebook/react/issues/2927
    render: function renderComment() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                {/* this.props.children is the content of the tag (in our case
                the actual comment */}
                {this.props.children}
            </div>
        );
    }
});

const CommentList = React.createClass({
    render: function renderCommentList() {
        const commentNodes = this.props.data.map((comment) => {
            return (
                <Comment author={comment.author} key={comment.id}>
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

const CommentForm = React.createClass({
    render: function renderCommentForm() {
        return (
            <div className="commentForm">
                I'm a CommentForm
            </div>
        );
    }
});

const CommentBox = React.createClass({
    render: function renderCommentBox() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                {/* passing an array of data received via CommentBox */}
                <CommentList data={this.props.data} />
                <CommentForm />
            </div>
        );
    }
});

ReactDOM.render(<CommentBox data={dummyData} />, contentDOM);
