import React from 'react'
import {Container} from 'semantic-ui-react';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Logger from '../js/Logger'

import Field from '../components/part/Field';
import Dropdown from '../components/part/Dropdown';
import InlineDatePicker from '../components/part/InlineDatePicker';
import InlineMonthPicker from '../components/part/InlineMonthPicker';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesPyranometer';

class Old2DevicesPyranometerSensingRecordsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.selectedKey = this.selectedKey.bind(this);
    this.selectUnit = this.selectUnit.bind(this);
    this.selectKey = this.selectKey.bind(this);
    this.state = {
      units: ["minute", "hour", "day"],
      unit: "day",
      selectedKey: null,
    };
  }

  componentDidMount() {
    // 初期表示時
    this.load();
  }

  componentWillReceiveProps(nextProps) {
    this.logger.log("componentWillReceiveProps", nextProps);
    if (this.props.item.id !== nextProps.item.id) {
      // デバイス変更時
      this.load(nextProps.item.id);
    }

    if (!this.state.selectedKey
      || this.props.enableSuperiorUnits !== nextProps.enableSuperiorUnits) {
      // 未選択時、または、有効なキーの変更時
      let initialSelectedKey = nextProps.enableSuperiorUnits[nextProps.enableSuperiorUnits.length - 1];

      // this.logger.log("componentWillReceiveProps", "init or diff!", "=>", initialSelectedKey);
      if (initialSelectedKey
        && this.state.selectedKey !== initialSelectedKey) {
        // this.logger.log("componentWillReceiveProps", "setState!", initialSelectedKey);
        this.setState({
          selectedKey: initialSelectedKey,
        })
      }
    }
  }

  load(id = this.props.item.id, unit = this.state.unit) {
    if (id) {
      this.props.actions.loadDevicesPyranometerStats(id, unit);
    }
  }

  selectedKey() {
    return this.state.selectedKey;
    // if (!this.state.selectedKey) {
    //   let initialSelectedKey = this.props.enableSuperiorUnits[this.props.enableSuperiorUnits.length - 1];
    //   if (this.state.selectedKey !== initialSelectedKey) {
    //     this.setState({
    //       selectedKey: initialSelectedKey,
    //     })
    //   }
    //   return initialSelectedKey;

    // } else {
    //   return this.state.selectedKey;
    // }

    // return this.state.selectedKey
    //   ? this.state.selectedKey
    //   : this.props.enableSuperiorUnits[this.props.enableSuperiorUnits.length - 1];
  }

  selectUnit(value) {
    // this.logger.log("select",
    //   this.props.recordsParDay[this.state.selectedDay],
    //   '=>', this.props.recordsParDay[value]);
    this.setState({unit: value});
    this.load(this.props.item.id, value);
  }

  selectKey(value) {
    this.logger.log("selectKey", value);
    this.setState({
      selectedKey: value,
    });
  }

  render() {
    return (
      <Container>
{/*        <Field label='date'>
          <Dropdown
            selection
            itemToOption={this.toDropdownOption}
            items={Object.keys(this.props.recordsParDay)}
            value={this.state.selectedDay}
            callback={(value) => { this.select(value)}}
          />
        </Field>
*/}

        <Field label='unit'>
          <Dropdown
            selection
            items={this.state.units}
            value={this.state.unit}
            callback={(value) => {this.selectUnit(value)}}
          />
        </Field>

        {(() => {
          if ("hour" === this.state.unit
            || "minute" === this.state.unit) {

          return (
            <Field>
              <InlineDatePicker
                selected={this.state.selectedKey}
                callback={this.selectKey}
                includeDates={this.props.enableSuperiorUnits}
              />
            </Field>
            );
          } else if ("day" === this.state.unit) {
          return (
            <Field>
              <InlineMonthPicker
                selected={this.state.selectedKey}
                callback={this.selectKey}
                includeDates={this.props.enableSuperiorUnits}
              />
            </Field>
            );
          }
        })()}

        <LineChart
          width={800}
          height={480}
          data={this.props.statsParGroupUnit[this.state.selectedKey]
            ? this.props.statsParGroupUnit[this.state.selectedKey]
            : []
          }
          margin={{top: 5, right: 30, left: 20, bottom: 5}}>

          <XAxis dataKey="_subordinateUnit"
            label={{value: 'sensed_at', position: 'insideBottom'}} />
          <YAxis yAxisId="left"
            label={{value: 'measurement', angle: -90, position: 'insideLeft'}} />
          <YAxis yAxisId="right" orientation="right"
            label={{value: 'samplings_count', angle: -90, position: 'insideRight'}} />
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend />
          {/*<Line type="monotone" dataKey="measurement" stroke="#8884d8" />*/}
          <Line yAxisId="left" type="monotone" dataKey="measurement" stroke="#8884d8" />
          <Line yAxisId="right" type="monotone" dataKey="samplings_count" stroke="#82ca9d" />
          <Line yAxisId="right" type="monotone" dataKey="counts" stroke="#f4a460" />
        </LineChart>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return  {
    statsParGroupUnit: state.devicesPyranometer.get('statsParGroupUnit').toJS(),
    enableSuperiorUnits: state.devicesPyranometer.get('enableSuperiorUnits').toJS(),
    progress: state.devicesPyranometer.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Old2DevicesPyranometerSensingRecordsGraph);
