import React, { Component } from "react";

var getDate = () => {
  var d = new Date();
  d.setSeconds(0);
  d.setMilliseconds(0);
};

export class Shift extends Component {
  state = {
    start: getDate(),
    end: getDate()
  };

  changeStart = data => {
    const { value } = data.target;
    const { id, handleDate } = this.props;
    console.log("startvalue", value);
    this.setState(
      prevState => {
        return {
          ...prevState,
          start: new Date(value),
          end: prevState.end
        };
      },
      handleDate(id, {
        start: new Date(value),
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
          end: new Date(value),
          start: prevState.start
        };
      },
      handleDate(id, {
        end: new Date(value),
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

  render() {
    const startValue = `${this.state.start.getFullYear()}-${`${this.state.start.getMonth() +
      1}`.padStart(2, 0)}-${`${this.state.start.getDate()}`.padStart(
      2,
      0
    )}T${`${this.state.start.getHours()}`.padStart(
      2,
      0
    )}:${`${this.state.start.getMinutes()}`.padStart(2, 0)}`;

    const endValue = `${this.state.end.getFullYear()}-${`${this.state.end.getMonth() +
      1}`.padStart(2, 0)}-${`${this.state.end.getDate()}`.padStart(
      2,
      0
    )}T${`${this.state.end.getHours()}`.padStart(
      2,
      0
    )}:${`${this.state.end.getMinutes()}`.padStart(2, 0)}`;
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
