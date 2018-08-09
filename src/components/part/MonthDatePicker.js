import React from 'react'
import {Container} from 'semantic-ui-react';

import Logger from '../../js/Logger'
import GtbUtils from '../../js/GtbUtils'

import Field from './Field';
import Dropdown from './Dropdown';
import InlineDatePicker from './InlineDatePicker';
import InlineMonthPicker from './InlineMonthPicker';


class MonthDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.selectUnit = this.selectUnit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      units: ["date", "month"],
      selectedUnit: "date",
      selectedDate: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    // this.logger.log("componentWillReceiveProps", this.props, nextProps);
    let prevKeys = this.props.includeDates;
    let nextKeys = nextProps.includeDates;
    if ("month" === this.state.selectedUnit) {
      prevKeys = this.props.includeMonths;
      nextKeys = nextProps.includeMonths;
    }

    prevKeys = prevKeys || [];
    nextKeys = nextKeys || [];
    // this.logger.log("keys", prevKeys, '=>', nextKeys);
    // this.logger.log("keys.length", prevKeys.length, '=>', nextKeys.length);

    if (!GtbUtils.compare(prevKeys, nextKeys)) {
      // 変更あり
      // this.logger.log("changed", prevKeys, '=>', nextKeys);

      if (!this.state.selectedDate
        || !nextKeys.includes(this.state.selectedDate)) {
        // 未だ未選択の場合、または、選択できない key の場合

        // this.logger.log("need change selected", prevKeys, '=>', nextKeys);
        let tailKey = nextKeys[nextKeys.length - 1];
        // this.logger.log("call onChange", tailKey);
        this.onChange(tailKey);
      }
    }
  }


  selectUnit(value) {
    // this.logger.log("selectUnit", value, this.props);
    this.setState({selectedUnit: value});

    if ("date" === value) {
      let last = this.props.includeDates[this.props.includeDates.length - 1];
      this.onChange(last, value);
    } else {
      let last = this.props.includeMonths[this.props.includeMonths.length - 1];
      this.onChange(last, value);
    }
  }

  onChange(value, unit = this.state.selectedUnit) {
    // this.logger.log("onChange", unit, value);
    if (this.state.selectedDate !== value) {
      this.setState({selectedDate: value});
      if (this.props.onChange) {
        this.props.onChange(unit, value);
      }
    }
  }

  render() {
    // this.logger.log("this.props", this.props);

    let {
      includeDates,
      includeMonths,
    } = this.props;

    return (
      <Container>
        <Field label='Unit'>
          <Dropdown
            selection
            items={this.state.units}
            value={this.state.selectedUnit}
            callback={(value) => {this.selectUnit(value)}}
          />
        </Field>

        {(() => {
          if ("date" === this.state.selectedUnit) {
            // this.logger.log("select date", this.state.selectedDate, includeDates);
            return (
              <Field label='Select Date'>
                <InlineDatePicker
                  selected={this.state.selectedDate}
                  callback={this.onChange}
                  includeDates={includeDates}
                />
              </Field>
              );
          } else if ("month" === this.state.selectedUnit) {
            // this.logger.log("select month", this.state.selectedDate, includeMonths);
            return (
              <Field label='Select Month'>
                <InlineMonthPicker
                  selected={this.state.selectedDate}
                  callback={this.onChange}
                  includeDates={includeMonths}
                />
              </Field>
              );
          }
        })()}

      </Container>
    );
  }
}

export default MonthDatePicker;
