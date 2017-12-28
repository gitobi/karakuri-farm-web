import React from 'react'
import EditableTable from '../components/common/EditableTable'
import Logger from '../js/Logger'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesPyranometer';

class DevicesPyranometerSensingRecords extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DevicesPyranometerSensingRecords'});
  }

  componentWillReceiveProps(nextProps, nextState) {
    // this.logger.log('componentWillReceiveProps', 'nextProps', nextProps);
  }

  render() {

    // テーブルのカラムレイアウト
    const columns = [{
        Header: 'ID',
        accessor: 'id',
        width: 120,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Sensed at',
        accessor: 'sensed_at',
        width: 180,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Measurement',
        accessor: 'measurement',
        width: 120,
        Cell: EditableTable.createNormalCell()
    }];

    return (
      <div className="ui container">
        <EditableTable
          data={this.props.devicesPyranometerSensingRecords}
          columns={columns}
          loading={this.props.progress}
          sortable={true}
          defaultSorted={[{id: 'sensed_at', desc: true}]}
        />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    selectedDevicesPyranometerId: state.devicesPyranometer.get('selectedId'),
    devicesPyranometerSensingRecords: state.devicesPyranometer.get('sensingRecords').toJS(),
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
