import React from 'react'
import {Container, Button} from 'semantic-ui-react';
import EditableTable from '../components/common/EditableTable'
import Logger from '../js/Logger'

import Field from '../components/part/Field';
import InlineDatePicker from '../components/part/InlineDatePicker';
import DevicesWateringOperationalRecordsGraph from '../components/DevicesWateringOperationalRecordsGraph';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesWatering';

class DevicesWateringOperationalRecords extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.load = this.load.bind(this);
    this.selectDate = this.selectDate.bind(this);
    this.csvDownload = this.csvDownload.bind(this);

    this.state = {
      selectedDate: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.item.id !== nextProps.item.id) {
      // デバイス変更時
      let itemId = nextProps.item.id;

      // 稼働日を取得
      this.props.actions.loadDevicesWateringWorkingDays(itemId)
      .then((result) => {
        // 最新稼働日を初期表示とする
        // this.logger.log("loaded workingDays", result, this.props.workingDays);
        let lastWorkingDay = this.props.workingDays[this.props.workingDays.length - 1];
        this.selectDate(lastWorkingDay);
      });
    }
  }

  load(id = this.props.item.id, selectedDate = this.state.selectedDate) {
    if (id) {
      this.props.actions.loadDevicesWateringOperationalRecords(id, selectedDate);
    }
  }

  selectDate(value) {
    // this.logger.log("selectDate", this.state.selectedDate, "=>", value);
    this.setState({selectedDate: value});
    this.load(this.props.item.id, value);
  }

  csvDownload() {
    let id = this.props.item.id;
    let selectedDate = this.state.selectedDate;
    this.props.actions.downloadDevicesWateringOperationalRecords(id, selectedDate);
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
          <InlineDatePicker
            selected={this.state.selectedDate}
            callback={this.selectDate}
            includeDates={this.props.workingDays}
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
        />

        <Button as='a'
          onClick={this.csvDownload}
          loading={this.props.progress}
          >
          csv
        </Button>

      </Container>
    );
  }
}

function mapStateToProps(state) {
  return  {
    workingDays: state.devicesWatering.getIn(['workingDays']).toJS(),
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
)(DevicesWateringOperationalRecords);
