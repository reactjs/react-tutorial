/**
 * Created by rpanos on 7/24/16.
 */



var CalcNumButton = React.createClass({
  handleClick: function(e) {
    e.preventDefault();

    this.props.onClickButton({clickType: "number", value: this.props.numValue});
  },
  render: function() {
    return (
      <div className="calcButton" >
        <h2 className="calcLabel" onClick={this.handleClick}>
          {this.props.label}
        </h2>
      </div>
    );
  }
});


var CalcOpsButton = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
    this.props.onClickButton({clickType: "operation", operation: this.props.operation});
  },
  render: function() {
    return (
      <div className="calcOpsButton" >
        <h2 className="calcLabel" onClick={this.handleClick}>
          {this.props.operation}
        </h2>
      </div>
    );
  }
});


var CalcScreen = React.createClass({
  getInitialState: function () {
    return { screenStr: this.props.initScreenStr };
  },
  handleScreenUpdate: function(value) {
    var newState = {};
    newState["screenStr"] = value;

    this.setState(newState);
  },
  render: function() {
    return (
      <div className="calcScreen" >
        <h2 className="calcScreenDisplay" >
          {this.state.screenStr}
        </h2>
      </div>
    );
  }
});


var Calculator = React.createClass({
  getInitialState: function () {
    return { screenVal: 0, screenStr: "0", lastInput: 0, pendingOperation: '' };
  },
  updateScreen: function() {
    var screen = this.refs.screen;
    screen.handleScreenUpdate(this.state.screenStr)
  },
  // Will only be called if the state is valid
  runOperation: function() {
    var newValue = 0;
    switch (this.state.pendingOperation) {
      case "+":
        newValue = this.state.lastInput + this.state.screenVal;
        break;
      case "-":
        newValue = this.state.lastInput - this.state.screenVal;
        break;
      case "*":
        newValue = this.state.lastInput * this.state.screenVal;
        break;
      case "/":
        newValue = this.state.lastInput / this.state.screenVal;
        break;
    }
    this.state.screenVal = newValue;
    this.state.screenStr = String(newValue);
    this.updateScreen();

  },
  handleClickButton: function(clickData) {

    if (typeof(clickData.clickType) !== 'undefined') {
      if (clickData.clickType == "number") {

        if (this.state.screenStr == "0" || this.state.pendingOperation != '') {
          this.state.screenStr = String(clickData.value);
        } else {
          this.state.screenStr = this.state.screenStr + String(clickData.value);
        }
        this.state.screenVal = parseInt(this.state.screenStr);
        this.updateScreen();
      } else if (clickData.clickType == "operation") {

        if (clickData.operation == "C") {
          this.state.lastInput = 0;  // UNDEFINED?
          this.state.screenVal = 0;
          this.state.screenStr = "0";
          this.state.pendingOperation = '';
          this.updateScreen();

        } else if (clickData.operation == "="
          && this.state.pendingOperation != '') { // ignore if we dont have an operation in waiting

          //  CHECK FOR VALID STATE?

          this.runOperation();

        } else {
          this.state.lastInput = this.state.screenVal;

          // WAIT til a num is given like most calculators?
          //this.state.screenVal = 0;
          //this.state.screenStr = "0";
          this.state.pendingOperation = clickData.operation;
          this.updateScreen();
        }

      } else {
        console.log("ERROR bad clickType: " + clickData.clickType);
      }

    } else {
      console.log("ERROR unknown clickType");
    }
  },
  render: function() {
    return (
      <div className="calculator">
        <CalcScreen initScreenStr={this.state.screenStr} ref="screen"/>
        <div className="calcRow">
          <CalcNumButton label='1' numValue={1} onClickButton={this.handleClickButton}/>
          <CalcNumButton label='2' numValue={2} onClickButton={this.handleClickButton}/>
          <CalcNumButton label="3" numValue={3} onClickButton={this.handleClickButton}/>
          <CalcNumButton label="4" numValue={4} onClickButton={this.handleClickButton}/>
          <CalcNumButton label="5" numValue={5} onClickButton={this.handleClickButton}/>
          <CalcNumButton label="6" numValue={6} onClickButton={this.handleClickButton}/>
        </div>
        <div className="calcRow">
          <CalcNumButton label='7' numValue={7} onClickButton={this.handleClickButton}/>
          <CalcNumButton label='8' numValue={8} onClickButton={this.handleClickButton}/>
          <CalcNumButton label="9" numValue={9} onClickButton={this.handleClickButton}/>
          <CalcNumButton label="0" numValue={0} onClickButton={this.handleClickButton}/>
          <div className="buttonGap"></div>
          <CalcOpsButton operation="=" onClickButton={this.handleClickButton}/>

        </div>
        <div className="calcRow">
          <CalcOpsButton operation='+' onClickButton={this.handleClickButton}/>
          <CalcOpsButton operation='-' onClickButton={this.handleClickButton}/>
          <CalcOpsButton operation="*" onClickButton={this.handleClickButton}/>
          <CalcOpsButton operation="/" onClickButton={this.handleClickButton}/>
          <div className="buttonGap"></div>
          <CalcOpsButton operation="C" onClickButton={this.handleClickButton}/>
        </div>
      </div>
    )
  }
});



ReactDOM.render(
  <Calculator />,
  document.getElementById('calculatorContainer')
);



