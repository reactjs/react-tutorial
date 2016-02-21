import React from 'react';
var Choice = function(props) {
    return (
      <div className="choice">
        <input type={props.type} value={props.text} name={props.type}/>
        <label>{props.text}</label>
      </div>
    );
};

export default Choice;
