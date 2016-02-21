import React from 'react';
import Question from './Question.js';
var QuestionPreview = React.createClass({
  render: function() {

    return (
      <div style={divStyle}>
        <h4>Question Preview</h4>
        <Question
          type={this.props.question.type}
          label={this.props.question.label}
          text={this.props.question.text}
          choices={this.props.question.choices}>
        </Question>
      </div>

    );
  }
});

export default QuestionPreview;

var divStyle = {
  marginTop: 20,
  padding:10,
  border: "1px dashed #333"
};
