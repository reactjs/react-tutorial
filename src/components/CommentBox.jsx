import React from "react"
import CommentList from "./CommentList"
import CommentForm from "./CommentForm"

export default class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  fetchValidation(response){
    if(response.ok){
      return response.json();
    } else {
      console.error(response.statusText)
    }
  }
  loadCommentsFromServer() {
    const req = new Request(this.props.url, {
      method: "GET"
    });
    fetch(req)
      .then(this.fetchValidation)
      .then((comments) => {
        this.setState({data: comments})
      })
      .catch((err) => {
        console.error(err);
      })
  }
  handleCommentSubmit(comment) {
    const comments = this.state.data;
    comment.id = Date.now();
    const newComments = comments.concat([comment]);
    this.setState({data: newComments});

    const headers = new Headers({
      'Content-Type': 'application/json',
      "accept": 'application/json'
    });
    const reqPost = new Request(this.props.url, {
      method: "POST",
      headers: headers,
      mode: 'cors',
      body: JSON.stringify(comment)
    });

    fetch(reqPost)
      .then(this.fetchValidation)
      .then((comments) => {
        this.setState({data: comments})
      })
      .catch((err) => {
        console.error(err);
      })
  }
  componentDidMount() {
    this.loadCommentsFromServer();
    setInterval(()=> this.loadCommentsFromServer, this.props.pollInterval);
  }
  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={(comment) => this.handleCommentSubmit(comment)} />
      </div>
    );
  }
}
