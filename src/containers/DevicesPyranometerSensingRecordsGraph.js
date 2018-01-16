import React from 'react'
import {Container} from 'semantic-ui-react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Logger from '../js/Logger'

import Field from '../components/part/Field';
import Dropdown from '../components/part/Dropdown';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesPyranometer';

class DevicesPyranometerSensingRecordsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.toDropdownOption = this.toDropdownOption.bind(this);
    this.select = this.select.bind(this);
    this.state = {selectedDay: null};
  }

  componentDidMount() {
    // 初期表示時
    this.load();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.item.id !== nextProps.item.id) {
      // デバイス変更時
      this.load(nextProps.item.id);
    }
  }

  load(id = this.props.item.id) {
    if (id) {
      this.props.actions.loadDevicesPyranometerSensingRecords(id);
    }
  }

  toDropdownOption(element) {
    return {
      value: element,
      text: element,
    }
  }

  select(value) {
    // this.logger.log("select",
    //   this.props.recordsParDay[this.state.selectedDay],
    //   '=>', this.props.recordsParDay[value]);
    this.setState({selectedDay: value});
  }

  render() {
    return (
      <Container>
        <Field label='date'>
          <Dropdown
            selection
            itemToOption={this.toDropdownOption}
            items={Object.keys(this.props.recordsParDay)}
            value={this.state.selectedDay}
            callback={(value) => { this.select(value)}}
          />
        </Field>

        <LineChart
          width={800}
          height={480}
          data={this.props.recordsParDay[this.state.selectedDay]
            ? this.props.recordsParDay[this.state.selectedDay]
            : []
          }
          margin={{top: 5, right: 30, left: 20, bottom: 5}}>

          <XAxis dataKey="sensed_at_time"
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
        </LineChart>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return  {
    records: state.devicesPyranometer.get('sensingRecords').toJS(),
    recordsParDay: state.devicesPyranometer.get('sensingRecordsParDay').toJS(),
    progress: state.devicesPyranometer.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesPyranometerSensingRecordsGraph);
