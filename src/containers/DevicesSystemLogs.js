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
      this.props.actions.loadDevicesSystemLogs(id);
    }
  }

  render() {

    // テーブルのカラムレイアウト
    const columns = [{
        Header: '発生日時',
        accessor: 'raised_at',
        width: 180,
      }, {
        Header: 'Priority',
        accessor: 'priority',
        width: 60,
      }, {
        Header: 'Application',
        accessor: 'application',
        width: 120,
      }, {
        Header: 'Process',
        accessor: 'process',
        width: 60,
      }, {
        Header: 'Thread',
        accessor: 'thread',
        width: 180,
        customCell: { divStyle: { textAlign: 'left' }}
      }, {
        Header: 'Summary',
        accessor: 'summary',
        width: 120,
        customCell: { divStyle: { textAlign: 'left' }}
      }, {
        Header: 'Detail',
        accessor: 'detail',
        width: 180,
        customCell: { divStyle: { textAlign: 'left' }}
      }, {
        Header: 'Trace',
        accessor: 'trace',
        width: 360,
        customCell: { divStyle: { textAlign: 'left' }}
    }];

    return (
      <div className="ui container">
        <EditableTable
          data={this.props.records}
          columns={columns}
          loading={this.props.progress}
          filterable={true}
          sortable={true}
          defaultSorted={[{id: 'updated_at', desc: true}]}
        />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    records: state.devicesSystemLog.get('list').toJS(),
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
