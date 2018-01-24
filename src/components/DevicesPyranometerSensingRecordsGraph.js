import React from 'react'
import {Container, Segment} from 'semantic-ui-react';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Logger from '../js/Logger'
import Header from '../components/part/Header'

class DevicesPyranometerSensingRecordsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    return (
      <Segment loading={this.props.loading}>
        <Header label={this.props.label}/>

        <LineChart
          data={this.props.data}

          width={800}
          height={360}
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

      </Segment>
    );
  }
}

export default DevicesPyranometerSensingRecordsGraph;
