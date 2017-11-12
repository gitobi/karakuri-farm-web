import React from 'react'
import EditableTable from '../components/common/EditableTable'
import Logger from '../js/Logger'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesWatering';

class DevicesWateringOperationalRecords extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DevicesWateringOperationalRecords'});
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.logger.log('componentWillReceiveProps', 'nextProps', nextProps);
  }

  render() {

    // テーブルのカラムレイアウト
    const columns = [{
        Header: 'ID',
        accessor: 'id',
        width: 120,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Started at',
        accessor: 'started_at',
        width: 180,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Ended at',
        accessor: 'ended_at',
        width: 180,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Amount',
        accessor: 'amount',
        width: 120,
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'is Manual',
        accessor: 'is_manual',
        width: 120,
        Cell: EditableTable.createNormalCell()
    }];

    return (
      <div className="ui container">
        <EditableTable
          data={this.props.devicesWateringOperationalRecords}
          columns={columns}
          loading={this.props.progress}
          sortable={true}
          defaultSorted={[{id: 'started_at', desc: true}]}
        />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    selectedDevicesWateringId: state.devicesWatering.get('selectedId'),
    devicesWateringOperationalRecords: state.devicesWatering.get('operationalRecords').toJS(),
    progress: state.devicesWatering.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesWateringOperationalRecords);
