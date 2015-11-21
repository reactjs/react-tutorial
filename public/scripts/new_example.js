var data = [
        {author: "Pertor",text: "This is Peter's Message"},
        {author: "Jack",text: "This is Jack's Message"},
    ];

var Comment = React.createClass({
      rawMarkup: function(){
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return { __html: rawMarkup};
      },

   
      render: function(){
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
      render: function(){
        var commentNodes = this.props.data.map(function(comment){
            return (
              <Comment author={comment.author}>
              {comment.text}
              </Comment>
            );
        });
        return(
            <div className="commentList">
                {commentNodes}
            </div>
        );

      }
    });

var CommentForm = React.createClass({
      handleSubmit: function(e){
        e.preventDefault();
        var author = this.refs.author.value.trim();
        var text = this.refs.text.value.trim();
        if (!text || !author) {
          return ;
        };
        this.props.onCommentSubmit({author: author, text: text});
        this.refs.author.value = '';
        this.refs.text.value = '';
        return;
      },

      render: function(){
        return (
              <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author" />
                <input type="text" placeholder="Say something..." ref="text" />
                <input type="submit" value="Post" />
              </form>
          );
      }
    });       
  // ceating Box module
  var CommentBox = React.createClass({
        loadCommentsFromServer: function() {
           $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'GET',
            cache: false,
            success: function(data){
              this.setState({data: data});
            }.bind(this),
            error: function(xhr,status,err){
              console.error(this.props.url, status, err.toString());
            }.bind(this)
          });
        },

        handleCommentSubmit: function(comment){
          var comments = this.state.data;
          var newComments = comments.concat([comment]);
          this.setState({data: newComments});
            $.ajax({
              url: this.props.url,
              dataType: 'json',
              type: 'POST',
              data: comment,
              success: function(data){
                this.setState({data: data});
              }.bind(this),
              error: function(xhr,status,err){
              console.error(this.props.url, status, err.toString());
              }.bind(this)
            });
        },

        getInitialState: function(){
          return {data: []};
        },
        componentDidMount: function(){
         this.loadCommentsFromServer();
         setInterval(this.loadCommentsFromServer, this.props.pollInterval);
        },
        render: function(){
          return (
            <div className="commentBox">
                  <h1>Comments</h1>
                  <CommentList data={this.state.data} />
                  <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
          );
        }
      });

      
      React.render(
        /*<CommentBox data={data} />,*/
        //In local test，using 'api/comments' will be 'NS_ERROR_DOM_BAD_URI: Access to restricted URI denied'
        //so i want to use 'http://localhost:3000/api/comments'
        <CommentBox url="http://localhost:3000/api/comments" pollInterval={2000} />,
        document.getElementById('content')
      );
      //Use JSX
    /* var CommentBox = React.createClass({displayName: 'CommentBox', 
          render: function(){
            return (
              /* React.createElement('div', {className: 'commentBox'}, 

                )
                <div className="commentBox">
                  <h1>Comments</h1>
                  <CommentList />
                  <CommentForm />
                </div>

              );
          }
      });

     ReactDOM.render(
        React.createElement(CommentBox, null),
        document.getElementById('content')
      );*/


