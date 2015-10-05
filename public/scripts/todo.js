var Todo = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="todo">
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var TodoBox = React.createClass({
  loadTodosFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoSubmit: function(todo) {
    var todos = this.state.data;
    var newTodos = todos.concat([todo]);
    this.setState({data: newTodos});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: todo,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadTodosFromServer();
    setInterval(this.loadTodosFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="todoBox">
        <h1>My Todo List</h1>
        <TodoList data={this.state.data} />
        <TodoForm onTodoSubmit={this.handleTodoSubmit} />
      </div>
    );
  }
});

var TodoList = React.createClass({
  render: function() {
    var todoNodes = this.props.data.map(function(todo) {
      return (
        <Todo>
          {todo.text}
        </Todo>
      );
    });
    return (
      <div className="todoList">
        {todoNodes}
      </div>
    );
  }
});

var TodoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var text = React.findDOMNode(this.refs.text).value.trim();

    this.props.onTodoSubmit({text: text});
    React.findDOMNode(this.refs.text).value = '';
  },
  render: function() {
    return (
      <form className="todoForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Add a Todo" ref="text" />
        <input type="submit" value="Submit" />
      </form>
    );
  }
});

React.render(
  <TodoBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
