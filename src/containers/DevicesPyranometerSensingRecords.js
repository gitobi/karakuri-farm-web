import React from 'react'
import {Container} from 'semantic-ui-react';
import EditableTable from '../components/common/EditableTable'
import Logger from '../js/Logger'

import Field from '../components/part/Field';
import InlineDatePicker from '../components/part/InlineDatePicker';
import DevicesPyranometerSensingRecordsGraph from '../components/DevicesPyranometerSensingRecordsGraph';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesPyranometer';

class DevicesPyranometerSensingRecords extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.load = this.load.bind(this);
    this.selectDate = this.selectDate.bind(this);

    this.state = {
      selectedDate: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    // this.logger.log("componentWillReceiveProps", nextProps);
    if (this.props.item.id !== nextProps.item.id) {
      // デバイス変更時
      let itemId = nextProps.item.id;

      // 稼働日を取得
      this.props.actions.loadDevicesPyranometerWorkingDays(itemId)
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
      this.props.actions.loadDevicesPyranometerSensingRecords(id, selectedDate);
    }
  }

  selectDate(value) {
    // this.logger.log("selectDate", this.state.selectedDate, "=>", value);
    this.setState({selectedDate: value});
    this.load(this.props.item.id, value);
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
      <Container>
        <Field label='Select Date'>
          <InlineDatePicker
            selected={this.state.selectedDate}
            callback={this.selectDate}
            includeDates={this.props.workingDays}
          />
        </Field>

        <DevicesPyranometerSensingRecordsGraph
          loading={this.props.progress}
          label={`Graph ${this.state.selectedDate || ""}`}
          data={this.props.records}
        />

        <EditableTable
          label={`Records ${this.state.selectedDate || ""}`}
          data={this.props.records}
          columns={columns}
          loading={this.props.progress}
          filterable={true}
          sortable={true}
          defaultSorted={[{id: 'sensed_at', desc: true}]}
          pageSizeOptions={[10, 60, 360, 720, 1440]}
          defaultPageSize={10}
        />

      </Container>
    );
  }
}

function mapStateToProps(state) {
  return  {
    workingDays: state.devicesPyranometer.getIn(['workingDays']).toJS(),
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
