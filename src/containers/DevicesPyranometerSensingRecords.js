import React from 'react'
import {Container} from 'semantic-ui-react';
import EditableTable from '../components/common/EditableTable'
import Logger from '../js/Logger'
import GtbUtils from '../js/GtbUtils'

import moment from 'moment';

import DecimalFormatter from '../js/formatter/DecimalFormatter'

import Field from '../components/part/Field';
import InlineDatePicker from '../components/part/InlineDatePicker';
import DevicesPyranometerSensingRecordsGraph from '../components/DevicesPyranometerSensingRecordsGraph';

// import DevicesPyranometerSensingRecordsGraph from './DevicesPyranometerSensingRecordsGraph'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesPyranometer';

class DevicesPyranometerSensingRecords extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.selectDate = this.selectDate.bind(this);
    // this.filter = this.filter.bind(this);
    // this.onFetchData = this.onFetchData.bind(this);

    this.state = {
      selectedDate: null,
    };


  }

  componentDidMount() {
    // 初期表示時
    this.load();
  }

  componentWillReceiveProps(nextProps) {
    this.logger.log("componentWillReceiveProps", nextProps);

    let needReload = false;
    let itemId = this.props.item.id;
    let selectedDate = this.state.selectedDate;
    if (itemId !== nextProps.item.id) {
      this.logger.log("componentWillReceiveProps change id", nextProps);
      // デバイス変更時
      itemId = nextProps.item.id;
      needReload = true;
    }

    if (!this.state.selectedDate && nextProps.lastWorkingDay) {
      // 未だ未選択で最終稼働日が取得された場合
      this.logger.log("componentWillReceiveProps first select", this.state.selectedDate);
      selectedDate = nextProps.lastWorkingDay
      this.setState({
        selectedDate: selectedDate,
      })
      needReload = true;

    } else if (!GtbUtils.compare(this.props.workingDays, nextProps.workingDays)
      && !nextProps.workingDays.includes(this.state.selectedDate)) {
      // または、最終稼働日の変更により、現在選択している日のデータが存在しなくなった場合
      this.logger.log("componentWillReceiveProps workingDays changed", this.props.workingDays, "=>", nextProps.workingDays);
      selectedDate = nextProps.lastWorkingDay
      this.setState({
        selectedDate: selectedDate,
      })
      needReload = true;
    }

    if (needReload) {
      this.load(itemId, selectedDate);
    }
  }

  load(id = this.props.item.id, selectedDate = this.state.selectedDate) {
    if (id && selectedDate) {
      // let min = moment(`${selectedDate} 00:00:00`).subtract(1, 'days');
      // let max = moment(`${selectedDate} 23:59:59`).add(1, 'days');
      let min = moment(`${selectedDate} 00:00:00`);
      let max = moment(`${selectedDate} 23:59:59`);
      let params = {
        filtered: [
        {id: "sensed_at", value: {min: min, max: max}}]};
      this.props.actions.loadDevicesPyranometerSensingRecordsPage(id, params);
    }
  }

  // onFetchData(params) {
  //   // this.logger.log('onFetchData:', params);
  //   let id = this.props.item.id;
  //   if (id) {
  //      // %{"0" => %{"id" => "measurement", "value" => "5"}}
  //     // params.filtered.push({id: "device_id", value: id});
  //     this.props.actions.loadDevicesPyranometerSensingRecordsPage(id, params);
  //   }
  // }

  selectDate(value) {
    this.logger.log("selectDate", this.state.selectedDate, "=>", value);
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
