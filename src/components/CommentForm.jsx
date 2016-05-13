import React from "react"

export default class CommentForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        author: "",
        text: ""
      };
    }
    handleAuthorChange(e) {
      this.setState({author: e.target.value});
    }
    handleTextChange(e) {
      this.setState({text: e.target.value});
    }
    handleSubmit(e) {
      e.preventDefault();
      const author = this.state.author.trim();
      const text = this.state.text.trim();
      if (!text || !author) {
        return;
      }
      this.props.onCommentSubmit({author: author, text: text});
      this.setState({author: '', text: ''});
    }
    render() {
      return (
        <form className="commentForm" onSubmit={(event) => this.handleSubmit(event)}>
          <input
            type="text"
            placeholder="Your name"
            value={this.state.author}
            onChange={(event) => this.handleAuthorChange(event)}
          />
          <input
            type="text"
            placeholder="Say something..."
            value={this.state.text}
            onChange={(event) => this.handleTextChange(event)}
          />
          <input type="submit" value="Post" />
        </form>
      );
    }
}
//update forced
