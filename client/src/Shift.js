import React, { Component } from "react";

var getDate = () => {
  var d = new Date();
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
};

export class Shift extends Component {
  state = {
    start: getDate().toString(),
    end: getDate().toString()
  };

  changeStart = data => {
    const { value } = data.target;
    const { id, handleDate } = this.props;
    console.log("startvalue", value);
    this.setState(
      prevState => {
        return {
          ...prevState,
          start: new Date(value).toString(),
          end: prevState.end
        };
      },
      handleDate(id, {
        start: new Date(value).toString(),
        end: this.state.end
      })
    );
  };

  changeEnd = data => {
    const { value } = data.target;
    const { id, handleDate } = this.props;
    console.log("endvalue", value);
    this.setState(
      prevState => {
        return {
          ...prevState,
          end: new Date(value).toString(),
          start: prevState.start
        };
      },
      handleDate(id, {
        end: new Date(value).toString(),
        start: this.state.start
      })
    );
  };

  componentWillMount() {
    console.log("props", this.props.start, this.props.end);
    this.setState(prevState => ({
      ...prevState,
      start: this.props.start,
      end: this.props.end
    }));
  }

  getInputValue = date => {
    date = new Date(date);
    return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
      2,
      0
    )}-${`${date.getDate()}`.padStart(2, 0)}T${`${date.getHours()}`.padStart(
      2,
      0
    )}:${`${date.getMinutes()}`.padStart(2, 0)}`;
  };

  render() {
    const startValue = this.getInputValue(this.state.start);

    const endValue = this.getInputValue(this.state.end);
    return (
      <React.Fragment>
        <div className="shift">
          <hr />
          <p>Vagt nr. {this.props.id + 1}</p>
          <p>Start tid</p>
          <input
            name="start"
            type="datetime-local"
            value={startValue}
            onChange={this.changeStart}
          ></input>
          <p>Slut tid</p>
          <input
            name="end"
            type="datetime-local"
            value={endValue}
            onChange={this.changeEnd}
          ></input>
          <hr />
        </div>
      </React.Fragment>
    );
  }
}

export default Shift;
