import React from 'react';
import Question from './Question.js';

var QuestionList = React.createClass({
  removeQuestion: function(event, id) {
    this.props.removeQuestion(id);
  },
  render: function() {
    var questionNodes = this.props.data.map(function(question) {
        return (
          <Question
            type={question.type}
            label={question.label}
            key={question.id}
            id={question.id}
            choices={question.choices}
            removeQuestion={(e) => this.removeQuestion(e, question.id)}
          >
          </Question>
        );

    }, this);
    return (
      <div className="questionList">
        {questionNodes}
      </div>
    );
  }
});

export default QuestionList;
