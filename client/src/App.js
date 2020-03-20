import React, { Component } from "react";
import Shift from "./Shift";

export class App extends Component {
  state = {
    defaultSalary: 67.3,
    bonus: {
      night: 13.23,
      saturday: 23.28,
      sunday: 25.9
    },
    laborMarket: 8.0,
    dates: [],
    shiftAmounts: 0
  };

  changeValue = (key, value) => {
    this.setState(prevState => ({
      ...prevState,
      [key]: Number.parseFloat(value)
    }));
  };

  changeBonusValue = (key, value) => {
    this.setState(prevState => ({
      ...prevState,
      bonus: {
        ...prevState.bonus,
        [key]: Number.parseFloat(value)
      }
    }));
  };

  handleDate = (id, value) => {
    const { start, end } = value;
    console.log("updating id", id);
    console.log(JSON.stringify(start), JSON.stringify(end));

    const { dates } = this.state;
    const newDateState = dates.map(date => {
      console.log(JSON.stringify(date));
      if (date.id != id) return date;

      return {
        ...date,
        start,
        end
      };
    });

    console.log(newDateState.map(out => JSON.stringify(out)));

    this.setState(prevState => ({
      ...prevState,
      dates: newDateState
    }));
  };

  calculateSalary = dates => {
    console.log("dates", JSON.stringify(dates));
    // Amount of default minutes
    var defMinutes = 0;
    // Amount of night minutes
    var nightMinutes = 0;
    // Amount of saturday minutes
    var satMinutes = 0;
    // Amount of sunday minutes
    var sunMinutes = 0;

    var pauseHours = 0;

    Object.keys(dates).forEach(dateID => {
      console.log(dateID);
      var date = dates[dateID];
      console.log(
        "date",
        date,
        "start",
        JSON.stringify(date.start),
        "end",
        JSON.stringify(date.end)
      );
      console.log(defMinutes, nightMinutes, satMinutes, sunMinutes, pauseHours);
      var startDefMinutes = defMinutes;
      var end = new Date(date.end);
      for (
        var d = new Date(date.start);
        d.getTime() < end.getTime();
        d.setTime(d.getTime() + 1000 * 60)
      ) {
        if (d.getDay() === 0) {
          // Sunday hours
          sunMinutes++;
          defMinutes++;
        } else if (d.getDay() === 6) {
          // Saturday hours
          defMinutes++;
          if (d.getHours() >= 15) {
            satMinutes++;
          }
        } else {
          // Everyday hours
          defMinutes++;
          if (d.getHours() >= 18) {
            nightMinutes++;
          }
        }
      }

      var dif = (defMinutes - startDefMinutes) / 60;
      pauseHours += dif >= 8 ? 0.75 : dif >= 7 ? 0.5 : 0;
    });

    var nightHours = (nightMinutes / 60).toFixed(2);
    var defHours = (defMinutes / 60).toFixed(2);
    var satHours = (satMinutes / 60).toFixed(2);
    var sunHours = (sunMinutes / 60).toFixed(2);

    console.log(defMinutes, nightMinutes, satMinutes, sunMinutes, pauseHours);

    var salary = (
      defHours * this.state.defaultSalary +
      nightHours * this.state.bonus["night"] +
      satHours * this.state.bonus["saturday"] +
      sunHours * this.state.bonus["sunday"]
    ).toFixed(2);
    var laborMarketRemoved = (salary * (this.state.laborMarket / 100)).toFixed(
      2
    );
    salary -= laborMarketRemoved;
    console.log("salary", salary);

    return {
      nightHours,
      sunHours,
      satHours,
      defHours,
      pauseHours,
      salary,
      laborMarketRemoved
    };
  };

  getDate = () => {
    var d = new Date();
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  };

  changeShiftAmounts = e => {
    const { value } = e.target;
    console.log(value);

    this.setState(
      prevState => {
        var dates = prevState.dates;
        var length = Object.keys(dates).length;
        var dif = value - length;
        console.log(dif);
        for (var i = 0; i < dif; i++) {
          dates.push({
            id: length + i,
            start: this.getDate().toString(),
            end: this.getDate().toString()
          });
        }
        console.log("updated length dates", dates);

        return {
          dates: dates,
          shiftAmounts: value > 31 ? 31 : value < 0 ? 0 : value
        };
      },
      () => this.calculateSalary({ ...this.state.dates })
    );
  };

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
    var datesOutput = [];

    for (var i = 0; i < this.state.shiftAmounts; i++) {
      var date = this.state.dates[i];
      console.log("Loading: " + JSON.stringify(date));

      datesOutput.push(
        <Shift
          id={i}
          key={i}
          start={date.start}
          end={date.end}
          handleDate={this.handleDate.bind(this)}
        ></Shift>
      );
    }

    const calc = this.calculateSalary(this.state.dates);
    console.log(calc);

    return (
      <div className="App">
        <h1>
          <img
            //src="https://upload.wikimedia.org/wikipedia/commons/e/ea/F%C3%B8tex_logo.svg"
            src="https://via.ritzau.dk/data/images/00257/10a363fe-02d0-4149-a5c4-662a497761fe-w_720.png"
            style={{ height: "30px" }}
            alt="Salling Group Logo"
          />{" "}
          Løn Beregner
        </h1>
        <div className="numberPicker">
          <label htmlFor="defaultSalary">Standard Løn:</label>
          <input
            id="defaultSalary"
            type="number"
            value={this.state.defaultSalary}
            onChange={e => this.changeValue("defaultSalary", e.target.value)}
            step="0.01"
          />
        </div>
        <div className="numberPicker">
          <label>Aften Bonus:</label>
          <input
            id="nightBonus"
            type="number"
            value={this.state.bonus["night"]}
            onChange={e => this.changeBonusValue("night", e.target.value)}
            step="0.01"
          />
        </div>
        <div className="numberPicker">
          <label>Lørdags Bonus:</label>
          <input
            id="saturdayBonus"
            type="number"
            value={this.state.bonus["saturday"]}
            onChange={e => this.changeBonusValue("saturday", e.target.value)}
            step="0.01"
          />
        </div>
        <div className="numberPicker">
          <label>Søndags Bonus:</label>
          <input
            id="sundayBonus"
            type="number"
            value={this.state.bonus["sunday"]}
            onChange={e => this.changeBonusValue("sunday", e.target.value)}
            step="0.01"
          />
        </div>
        <div className="numberPicker">
          <label>Arbejdsmarkedsbidrag:</label>
          <input
            id="laborMarket"
            type="text"
            value={this.state.laborMarket + "%"}
            onChange={e => this.changeValue("laborMarket", e.target.value)}
            step="0.01"
            readOnly
          />
        </div>
        <div className="numberPicker">
          <label>Antal vagter:</label>
          <input
            id="shiftAmt"
            type="number"
            value={this.state.shiftAmounts}
            onChange={this.changeShiftAmounts}
            step="1"
          />
        </div>

        <hr />
        <div className="salaryCalculations">
          <h2>
            Antal timer:{" "}
            <span>
              {+calc.defHours} (
              {+(calc.defHours * this.state.defaultSalary).toFixed(2)} kr)
            </span>
          </h2>
          <h2>
            Aften timer:{" "}
            <span>
              {+calc.nightHours} (
              {+(calc.nightHours * this.state.bonus["night"]).toFixed(2)} kr)
            </span>
          </h2>
          <h2>
            Lørdags timer:{" "}
            <span>
              {+calc.satHours} (
              {+(calc.satHours * this.state.bonus["saturday"]).toFixed(2)} kr)
            </span>
          </h2>
          <h2>
            Søndags timer:{" "}
            <span>
              {+calc.sunHours} (
              {+(calc.sunHours * this.state.bonus["sunday"]).toFixed(2)} kr)
            </span>
          </h2>
          <h2>
            Pause timer: <span>{+calc.pauseHours.toFixed(2)}</span>
          </h2>
          <h2>
            Arbejdsmarkedsbidrag fjernet:{" "}
            <span>{+calc.laborMarketRemoved} kr</span>
          </h2>
          <hr />
          <h1>
            Løn: <span>{+calc.salary} kr</span>
          </h1>
        </div>

        <hr />

        <div className="shifts">{datesOutput}</div>
      </div>
    );
  }
}

export default App;
