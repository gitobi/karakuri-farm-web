import React from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Logger from '../js/Logger'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesPyranometer';

class DevicesPyranometerSensingRecordsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  componentDidMount() {
    // 初期表示時
    this.load();
  }

  componentWillReceiveProps(nextProps, nextState) {
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

  render() {

    // テーブルのカラムレイアウト
    const columns = [{
        Header: 'ID',
        accessor: 'id',
        width: 120,
      }, {
        Header: 'Sensed at',
        accessor: 'sensed_at',
        width: 180,
      }, {
        Header: 'Measurement',
        accessor: 'measurement',
        width: 120,
      }, {
        Header: 'Samplings_count',
        accessor: 'samplings_count',
        width: 120,
    }];

    return (
      <div className="ui container">
        <div>
          <LineChart width={600} height={300} data={this.props.records}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey="sensed_at"/>
            {/*<YAxis yAxisId="left" />*/}
            {/*<YAxis yAxisId="right" orientation="right" />*/}
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />
            <Line type="monotone" dataKey="measurement" stroke="#8884d8" />
            {/*<Line yAxisId="left" type="monotone" dataKey="measurement" stroke="#8884d8" />*/}
            {/*<Line yAxisId="right" type="monotone" dataKey="samplings_count" stroke="#82ca9d" />*/}
          </LineChart>
        </div>
      </div>
    );

    // return (
    //   <div className="ui container">
    //     <EditableTable
    //       data={this.props.records}
    //       columns={columns}
    //       loading={this.props.progress}
    //       filterable={true}
    //       sortable={true}
    //       defaultSorted={[{id: 'sensed_at', desc: true}]}
    //     />

    //   </div>
    // );
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
)(DevicesPyranometerSensingRecordsGraph);
