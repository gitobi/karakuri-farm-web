import React from 'react'
import {Segment} from 'semantic-ui-react';

import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Logger from '../js/Logger'
import Header from '../components/part/Header'

class DevicesWateringOperationalRecordsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    return (
      <Segment loading={this.props.loading}>
        <Header label={this.props.label}/>

        <ResponsiveContainer width="100%" height={360}>
          <LineChart
            data={this.props.data}

            margin={{top: 5, right: 30, left: 20, bottom: 5}}>

            <XAxis dataKey="_plotX"
              label={{value: 'started_at', offset: -3, position: 'insideBottom'}} />
            <YAxis yAxisId="left"
              label={{value: 'amount', angle: -90, position: 'insideLeft'}} />
            <YAxis yAxisId="right" orientation="right"
              label={{value: 'duration', angle: 90, position: 'insideRight'}} />
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend verticalAlign="top" height={36} />
            <Line yAxisId="left" type="monotone" dataKey="amount" stroke="#8884d8" />
            <Line yAxisId="right" type="monotone" dataKey="duration" stroke="#82ca9d" />
            {(() => {if (this.props.counts) {
              return <Line yAxisId="right" type="monotone" dataKey="counts" stroke="#f4a460" />;
            }})()}
          </LineChart>
        </ResponsiveContainer>

      </Segment>
    );
  }
}

export default DevicesWateringOperationalRecordsGraph;
