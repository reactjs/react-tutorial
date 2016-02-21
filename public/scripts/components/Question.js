import React from 'react';
import ShortAnswer from './ShortAnswer.js';
import LongAnswer from './LongAnswer.js';
import MultipleChoice from './MultipleChoice.js';
import SingleChoice from './singleChoice.js';

var Question = React.createClass({
  render: function() {
    var answerTypes = {
      short_answer: ShortAnswer,
      long_answer: LongAnswer,
      single_choice: SingleChoice,
      multiple_choice: MultipleChoice
    };
    if (this.props.type) {
      return answerTypes[this.props.type](this.props);
    } else {
      return answerTypes['short_answer'](this.props);
    }

  }
});

export default Question;
