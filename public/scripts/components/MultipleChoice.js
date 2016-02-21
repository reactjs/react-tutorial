import React from 'react';
import Choice from './Choice.js';
var MultipleChoice = function(props) {
  var choiceNodes = props.choices.map(function(choice) {
    return (
      <Choice key={choice.id} type="checkbox" text={choice.text}>
      </Choice>
    );
  });
  return (
    <div className="question">
      <fieldset>
        <legend className="questionLabel">
          {props.label}
        </legend>
        {choiceNodes}
      </fieldset>
      { props.id &&
      <button type="button" onClick={props.removeQuestion} className="remove">x</button>
      }
    </div>
  );
};

export default MultipleChoice;
