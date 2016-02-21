import React from 'react';
var ShortAnswer = function(props) {
  return(
    <div className="question">
      <label className="questionLabel">
        {props.label}
      </label>
      <input />
      { props.id &&
        <button type="button" onClick={props.removeQuestion} className="remove">x</button>
      }
    </div>
  );

};

export default ShortAnswer;
