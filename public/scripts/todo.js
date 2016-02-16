var Todo = React.createClass({
  propTypes: {
    handleSubmit: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      list: [],
      currentValue: ''
    };
  },

  _handleSubmit: function(evt) {
    evt.preventDefault();
    var value = this.state.currentValue;
    var result = this.state.list.splice(0);

    result.push(value);

    this.setState({
      list: result,
      currentValue: ''
    });
  },

  _delete(idx) {
    var result = this.state.list.splice(0);
    result.splice(idx, 1);

    this.setState({
      list: result
    })
  },

  _handleChange(evt) {
    const {value} = evt.target;
    this.setState({currentValue: value});
  },

  _clearInput() {
    this.setState({currentValue: ''});
  },

  _clearAll() {
    this.setState({list: []});
  },

  render: function() {

    const list = this.state.list.map((value, index) => {
      return (
        <List
          key={index}
          id={index}
          onDelete={this._delete}
          text={value} />
      );
    });

    return (
      <div>
        <form onSubmit={this._handleSubmit}>
        <input
          type='text'
          name='search'
          value={this.state.currentValue}
          onChange={this._handleChange}/>

          <button type='submit'>Submit</button>
        </form>
        <button onClick={this._clearInput}>Clear Input</button>
        <button onClick={this._clearAll}>Clear All</button>
        <ul>
          {list}
        </ul>
      </div>
    );
  }
});


var List = React.createClass({
  propTypes: {
    id: React.PropTypes.number,
    text: React.PropTypes.string,
    onDelete: React.PropTypes.func
  },
  render: function() {
    return (
      <li>
        {this.props.text}
        <button
          onClick={() => this.props.onDelete(this.props.id)}>
          Delete
          </button>
      </li>
    );
  }
});

ReactDOM.render(
  <Todo />,
  document.getElementById('content')
);
