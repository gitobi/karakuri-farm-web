import React, { Component } from 'react';
// スタイルを合わせるためにcssを読む
import 'react-datepicker/dist/react-datepicker.css';

import Logger from '../../js/Logger'

class InlineMonthPicker extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.selectedYear = this.selectedYear.bind(this);
    this.selectedMonth = this.selectedMonth.bind(this);
    this.displayedYearMonth1 = this.displayedYearMonth1.bind(this);
    this.displayedYearMonth2 = this.displayedYearMonth2.bind(this);
    this.isDisableYearMonth = this.isDisableYearMonth.bind(this);
    this.isDisableYear = this.isDisableYear.bind(this);
    this.navigateDisplayYear = this.navigateDisplayYear.bind(this);

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      displayedYear: "--",
    };
  }

  componentDidMount() {
    // 初期表示時
    if (this.props.selected) {
      this.setState({
        displayedYear: this.props.selected.substr(0, 4)
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.selected !== nextProps.selected)
      && nextProps.selected) {

      let selectedYear = nextProps.selected.substr(0, 4);
      if (((selectedYear * 1) !== (this.state.displayedYear * 1))
        && ((selectedYear * 1) !== (this.state.displayedYear * 1) + 1)) {

        this.setState({
          displayedYear: nextProps.selected.substr(0, 4)
        });
      }
    }
  }

  selectedYear() {
    return this.props.selected ? this.props.selected.substr(0, 4) : "";
  }

  selectedMonth() {
    return this.props.selected ? this.props.selected.substr(5, 2) : "";
  }

  displayedYearMonth1(month) {
    return `${this.state.displayedYear}-${month}`;
  }

  displayedYearMonth2(month) {
    return `${(this.state.displayedYear * 1) + 1}-${month}`;
  }

  navigateDisplayYear(increment) {
    let nextDisplayedYear = (this.state.displayedYear * 1) + increment;
    this.setState({displayedYear: nextDisplayedYear});
  }

  isDisableYear(increment) {
    let nextDisplayedYear = (this.state.displayedYear * 1) + increment;
    let finded = this.props.includeDates.find((element) => {return element.startsWith(nextDisplayedYear);});
    // this.logger.log("isDisableYear?", nextDisplayedYear, this.props.includeDates, finded);
    return finded ? false : true;
  }

  isDisableYearMonth(yearMonth) {
    return !this.props.includeDates.includes(yearMonth);
  }

  onClick(yearMonth) {
    if (this.isDisableYearMonth(yearMonth)) {
      return;
    }

    // this.logger.log('onClick:', yearMonth);
    if (this.props.selected !== yearMonth) {
      this.onChange(yearMonth);
    }
  }

  onChange(value) {
    // this.logger.log('onChange:', this.props.selected, '->', value);
    if (this.props.callback) {
      this.props.callback(value);
    }
  }

  render() {
    const cell1 = (value) => {
      return (
        <div
          key={value.key}
          className={
            "react-datepicker__day "
            + (this.props.selected === this.displayedYearMonth1(value.key) ? "react-datepicker__day--selected " : "")
            + (this.isDisableYearMonth(this.displayedYearMonth1(value.key)) ? "react-datepicker__day--disabled " : "")
            }
          onClick={() => this.onClick(this.displayedYearMonth1(value.key))}
          >
            {value.text}
        </div>
        );
    }

    const cell2 = (value) => {
      return (
        <div
          key={value.key}
          className={
            "react-datepicker__day "
            + (this.props.selected === this.displayedYearMonth2(value.key) ? "react-datepicker__day--selected " : "")
            + (this.isDisableYearMonth(this.displayedYearMonth2(value.key)) ? "react-datepicker__day--disabled " : "")
            }
          onClick={() => this.onClick(this.displayedYearMonth2(value.key))}
          >
            {value.text}
        </div>
        );
    }

    let params1 = [
      {key: "01", text: "1月"},
      {key: "02", text: "2月"},
      {key: "03", text: "3月"},
      {key: "04", text: "4月"},
      {key: "05", text: "5月"},
      {key: "06", text: "6月"},
      ];
    let params2 = [
      {key: "07", text: "7月"},
      {key: "08", text: "8月"},
      {key: "09", text: "9月"},
      {key: "10", text: "10月"},
      {key: "11", text: "11月"},
      {key: "12", text: "12月"},
      ];
    let list11 = params1.map(cell1);
    let list12 = params2.map(cell1);
    let list21 = params1.map(cell2);
    let list22 = params2.map(cell2);


    // this.logger.log("render:", options, '->', this.props.value);
    return (

      <div className="react-datepicker">
        {(() => { if (!this.isDisableYear(-1)) { return (
          <a className="react-datepicker__navigation react-datepicker__navigation--previous "
            onClick={() => this.navigateDisplayYear(-1)}> </a>
        );}})()}
        {(() => { if (!this.isDisableYear(1)) { return (
          <a className="react-datepicker__navigation react-datepicker__navigation--next"
            onClick={() => this.navigateDisplayYear(1)}> </a>
        );}})()}
        <div className="react-datepicker__month-container">
          <div className="react-datepicker__header">
            <div className="react-datepicker__current-month">
              {this.state.displayedYear}
            </div>
          </div>
          <div className="react-datepicker__month" role="listbox">
            <div className="react-datepicker__week">
              {list11}
            </div>
            <div className="react-datepicker__week">
              {list12}
            </div>
          </div>
        </div>
        <div className="react-datepicker__month-container">
          <div className="react-datepicker__header">
            <div className="react-datepicker__current-month">
              {this.state.displayedYear === "--" ? "--" : (this.state.displayedYear * 1) + 1}
            </div>
          </div>
          <div className="react-datepicker__month" role="listbox">
            <div className="react-datepicker__week">
              {list21}
            </div>
            <div className="react-datepicker__week">
              {list22}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default InlineMonthPicker;
