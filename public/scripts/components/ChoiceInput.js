import React from 'react';
var ChoiceInput = React.createClass({
  addChoiceInput: function() {
    this.props.addChoice();
  },
  handleTextChange: function(e, key) {
    this.props.choiceTextChange(e.target.value, key);
  },
  removeChoice: function(e, key) {
    this.props.removeChoice(key);
  },
  render:function() {
      var choices = this.props.choices.map(function(choice) {
        return (
          <div key={choice.id} className="question">
            <input
              type="text"
              placeholder="Question Choice Text"
              defaultValue={choice.text}
              onChange={(e) => this.handleTextChange(e, choice.id)}
            />
            <button type="button" onClick={(e) => this.removeChoice(e, choice.id)} className="remove">x</button>
          </div>)
      }, this);
    return (
      <div>
        {choices}
        <button type="button" onClick={this.addChoiceInput}>Add Choice</button>
      </div>
    );
  }
});

export default ChoiceInput;
