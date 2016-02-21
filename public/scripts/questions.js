import React from 'react';
import ReactDOM from 'react-dom';
import QuestionList from './components/QuestionList.js';
import QuestionForm from './components/QuestionForm.js';

var App = React.createClass({
  loadQuestionsFromServer: function() {
    var self = this;
    $.ajax({
      url: this.props.url,
      dataType: 'json',
    }).done(
        function(data){
          self.setState({data: data});
      }
    ).fail(
        function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }
      );
  },
  handleQuestionSubmit: function(question) {
    //give the question an id
    question.id = Date.now();

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: question
    }).done(
        function(data) {
          this.setState({data:data})
        }
    ).fail(
        function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }
    );
  },
  getInitialState: function() {
    return { data: [] };
  },
  componentDidMount: function() {
    this.loadQuestionsFromServer();
  },
  removeQuestion: function(id) {
    var self = this;
    if(confirm('Are you sure you want to delete this question?')) {
      $.ajax({
        url: this.props.url + "/" + id,
        type: "DELETE"
      }).done(
        function(data) {
          self.setState( { data:data } );
        }
      ).fail(
        function(xhr, status, err) {
          console.error( this.props.url, status, err.toString() );
        }
      );
    }
  },
  render: function() {
    return (
      <div className="questionBox">
        <div className="questionFormColumn">
          <QuestionForm
            QuestionSubmit={ this.handleQuestionSubmit }
          />
        </div>
        <div className="questionListColumn">
          <h1>Questions</h1>
          <QuestionList data={ this.state.data } removeQuestion={ this.removeQuestion }/>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <App url="/api/questions" />,
  document.getElementById('content')
);
