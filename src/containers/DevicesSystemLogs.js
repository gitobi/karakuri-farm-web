import React from 'react'
import EditableTable from '../components/common/EditableTable'
import Logger from '../js/Logger'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesSystemLog';

class DevicesSystemLogs extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DevicesSystemLogs'});
  }

  componentWillReceiveProps(nextProps, nextState) {
    // デバイス変更時に取得する
    // this.logger.log('componentWillReceiveProps', 'nextProps', nextProps);
    if (nextProps.deviceId !== "" &&
      this.props.deviceId !== nextProps.deviceId) {
      nextProps.actions.loadDevicesSystemLogs(nextProps.deviceId);
    }
  }

  render() {

    // テーブルのカラムレイアウト
    const columns = [{
        Header: '発生日時',
        accessor: 'raised_at',
        width: 180,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Priority',
        accessor: 'priority',
        width: 60,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Application',
        accessor: 'application',
        width: 120,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Process',
        accessor: 'process',
        width: 60,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Thread',
        accessor: 'thread',
        width: 180,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Summary',
        accessor: 'summary',
        width: 120,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Detail',
        accessor: 'detail',
        width: 180,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Trace',
        accessor: 'trace',
        width: 360,
        Cell: EditableTable.createNormalCell()
    }];

    return (
      <div className="ui container">
        <EditableTable
          data={this.props.devicesSystemLogs}
          columns={columns}
          loading={this.props.progress}
          sortable={true}
          defaultSorted={[{id: 'updated_at', desc: true}]}
        />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    devicesSystemLogs: state.devicesSystemLog.get('list').toJS(),
    progress: state.devicesSystemLog.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesSystemLogs);
