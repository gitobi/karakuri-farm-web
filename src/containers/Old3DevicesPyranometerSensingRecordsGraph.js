import React from 'react'
import {Container} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Logger from '../js/Logger'

import Field from '../components/part/Field';
import Dropdown from '../components/part/Dropdown';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesPyranometer';

class Old3DevicesPyranometerSensingRecordsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    return (
      <Container>
        <LineChart
          width={800}
          height={480}
          data={this.props.records}
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
    progress: state.devicesPyranometer.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Old3DevicesPyranometerSensingRecordsGraph);
