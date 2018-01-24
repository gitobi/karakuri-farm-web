import React, { Component } from 'react';
import UIDatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import Logger from '../../js/Logger'

class InlineDatePicker extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.onChange = this.onChange.bind(this);
  }

  onChange(moment) {
    // this.logger.log('onChange:', this.props.selected, '->', moment);
    if (this.props.selected !== moment
      && this.props.callback) {
      this.props.callback(moment.format('YYYY-MM-DD'));
    }
  }

  render() {
    let {
      selected,
      callback,
      includeDates,
      ...rest,
    } = this.props;


    // this.logger.log("render:", options, '->', this.props.value);
    return (
      <UIDatePicker
        inline
        dateFormat="YYYY/MM/DD"
        todayButton={"today"}
        selected={moment(selected, "YYYY-MM-DD")}
        onChange={this.onChange}
        includeDates={includeDates ? includeDates.map(value => moment(value, "YYYY-MM-DD")) : undefined}
        {...rest}
      />
    );
  }
}
export default InlineDatePicker;
