import React from 'react'
import EditableTable from '../components/common/EditableTable'
import Logger from '../js/Logger'

import DecimalFormatter from '../js/formatter/DecimalFormatter'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesPyranometer';

class DevicesPyranometerSensingRecords extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.filter = this.filter.bind(this);
    this.onFetchData = this.onFetchData.bind(this);
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

  filter(value) {
    this.logger.log('filter:', value);
  }

  onFetchData(params) {
    // this.logger.log('onFetchData:', params);
    let id = this.props.item.id;
    if (id) {
       // %{"0" => %{"id" => "measurement", "value" => "5"}}
      // params.filtered.push({id: "device_id", value: id});
      this.props.actions.loadDevicesPyranometerSensingRecordsPage(id, params);
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
        customFilter: { type: 'date', callback: this.filter },
      }, {
        Header: 'Measurement',
        accessor: 'measurement',
        width: 120,
        customFilter: { type: 'range', formatter: new DecimalFormatter(), callback: this.filter },
      }, {
        Header: 'Samplings_count',
        accessor: 'samplings_count',
        width: 120,
    }];

    return (
      <div className="ui container">
        <EditableTable
          data={this.props.records}
          columns={columns}
          loading={this.props.progress}
          filterable={true}
          sortable={true}
          onFetchData={this.onFetchData}
          defaultSorted={[{id: 'sensed_at', desc: true}]}
        />

      </div>
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
)(DevicesPyranometerSensingRecords);
