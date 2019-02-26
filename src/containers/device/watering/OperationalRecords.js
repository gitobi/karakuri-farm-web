import React from 'react'
import {Container} from 'semantic-ui-react';
import EditableTable from '../../../components/common/EditableTable'
import RecordDownloader from '../../../components/common/RecordDownloader'
import Logger from '../../../js/Logger'

import Field from '../../../components/part/Field';
import MonthDatePicker from '../../../components/part/MonthDatePicker';
import DevicesWateringOperationalRecordsGraph from '../../../components/DevicesWateringOperationalRecordsGraph';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../../actions/devicesWatering';

class OperationalRecords extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.loadWorkingDays = this.loadWorkingDays.bind(this);
    this.selectDate = this.selectDate.bind(this);

    this.state = {
      selectedUnit: null,
      selectedDate: null,
    };
  }

  componentDidMount() {
    this.loadWorkingDays();
  }

  componentWillReceiveProps(nextProps) {
    // this.logger.log("componentWillReceiveProps", this.props.item, nextProps.item);
    if (this.props.item.id !== nextProps.item.id) {
      // デバイス変更時
      let itemId = nextProps.item.id;
      this.loadWorkingDays(itemId);
    }
  }

  loadWorkingDays(id = this.props.item.id) {
    // this.logger.log("loadWorkingDays", id);
    if (id) {
      // 稼働日を取得
      this.props.actions.loadDevicesWateringWorkingDays(id);
    }
  }

  selectDate(unit, value) {
    // this.logger.log("selectDate", this.state.selectedDate, "=>", value);
    this.setState({
      selectedUnit: unit,
      selectedDate: value,
    });
    // this.logger.log("selectDate", unit, value);
    if (unit && value) {
      this.props.actions.loadDevicesWateringOperationalRecords(this.props.item.id, unit, value);
    } else {
      this.props.actions.clearDevicesWateringOperationalRecords(this.props.item.id);
    }
  }

  render() {

    // テーブルのカラムレイアウト
    const columns = [{
        Header: 'ID',
        accessor: 'id',
        width: 120,
      }, {
        Header: 'Started at',
        accessor: 'started_at',
        width: 180,
      }, {
        Header: 'Ended at',
        accessor: 'ended_at',
        width: 180,
      }, {
        Header: 'Duration',
        accessor: 'duration',
        width: 120,
      }, {
        Header: 'Amount',
        accessor: 'amount',
        width: 120,
      }, {
        Header: 'is Manual',
        accessor: 'is_manual',
        width: 120,
    }];

    return (
      <Container>
        <Field label='Select Date'>
          <MonthDatePicker
            includeDates={this.props.workingDays}
            includeMonths={this.props.workingMonths}
            // selected={this.state.selectedDate}
            onChange={this.selectDate}
          />
        </Field>

        <DevicesWateringOperationalRecordsGraph
          loading={this.props.progress}
          label={`Graph ${this.state.selectedDate || ""}`}
          data={this.props.records}
        />

        <EditableTable
          data={this.props.records}
          columns={columns}
          loading={this.props.progress}
          filterable={true}
          sortable={true}
          defaultSorted={[{id: 'started_at', desc: true}]}
        >
          <RecordDownloader
            data={this.props.records}
            fileName={this.state.selectedDate}
          />
        </EditableTable>

      </Container>
    );
  }
}

function mapStateToProps(state) {
  return  {
    workingDays: state.devicesWatering.getIn(['workingDays']).toJS(),
    workingMonths: state.devicesWatering.getIn(['workingMonths']).toJS(),
    records: state.devicesWatering.get('operationalRecords').toJS(),
    progress: state.devicesWatering.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OperationalRecords);
