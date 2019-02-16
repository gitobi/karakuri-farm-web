import React, { Component } from 'react';
import UIDatePicker from 'react-datepicker';
import ErrorBoundary from '../common/ErrorBoundary';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import Logger from '../../js/Logger'

class InlineDatePicker extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.onChange = this.onChange.bind(this);

    this.state = {
      selected: null,
      includeDates: [],
    }
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    // new Logger({prefix: "InlineDatePicker"}).log('getDerivedStateFromProps:', prevState, '->', nextProps);
    if (prevState.selected !== nextProps.selected
      && prevState.includeDates !== nextProps.includeDates) {
      return {
        selected: nextProps.selected,
        includeDates: nextProps.includeDates
      };
    }
    return null;
  }

  onChange(moment) {
    // this.logger.log('onChange:', this.state.selected, '->', moment);
    if (this.state.selected !== moment
      && this.props.callback) {
      let selectedYmd = moment ? moment.format("YYYY-MM-DD") : undefined;
      this.props.callback(selectedYmd);
      this.setState({
        selected: selectedYmd
      });
    }
  }

  render() {
    let {
      selected,
      callback,
      includeDates,
      ...rest
    } = this.props;

    let t_selected = this.state.selected ? moment(this.state.selected, "YYYY-MM-DD") : undefined;
    let t_includeDates = this.state.includeDates ? includeDates.map(value => moment(value, "YYYY-MM-DD")) : undefined
    // this.logger.log("render:", options, '->', this.props.value);
    // this.logger.log("rest:", rest);
    // this.logger.log("tmp:", t_selected, t_includeDates);
    return (
      <ErrorBoundary>
        <UIDatePicker
          inline
          monthsShown={2}
          dateFormat="YYYY/MM/DD"
          todayButton={"today"}
          selected={t_selected}
          onChange={this.onChange}
          includeDates={t_includeDates}
          {...rest}
        />
      </ErrorBoundary>
    );
  }
}
export default InlineDatePicker;
