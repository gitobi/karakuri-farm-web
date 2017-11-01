import React from 'react'
import { Button } from 'semantic-ui-react';
import EditableTable from './common/EditableTable'
import Logger from '../js/Logger'
import Formatter from '../js/Formatter'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/deviceWatering';

class DeviceWateringsSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DeviceWateringsSchedule'});
    this.state = {
      saveButtonDisabled: true,
      loading: false,
    };

    this.update = this.update.bind(this);
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentWillMount() {
    // マウント時にスケジュール情報をロードする
    // this.logger.log('componentWillMount', this.props, this.state);
    this.load();
  }

  update(event, data, row, args) {
    // セル入力時の処理
    this.props.actions.updateDeviceWateringSchedule(row.row.id, row.column.id, data.value);

    // this.logger.info('updated',
    //   'event', event,
    //   'data', data,
    //   'row', row,
    //   'args', args,
    //   'props', this.props,
    //   'state', this.state);


    // this.props.deviceWateringsSchedules[0].amount = 'aaa';

    // TODO 変更された値を フォーマッティングしつつ this.state.schedules にツッコミ、
    // かつ、変更点をBastetに送れるように何とかする
    // 後、削除ボタンを押されたときにいい感じに削除する
  }

  load(deviceId) {
    // ロードボタンクリック時の処理
    this.setState({loading: true});
    this.props.actions.loadDeviceWateringSchedules();
    this.setState({loading: false});
  }

  save() {
    // セーブボタンクリック時の処理
    this.setState({loading: true});
    this.props.actions.saveDeviceWateringSchedules();
    this.setState({saveButtonDisabled: true});
    this.setState({loading: false});
  }

  add() {
    // スケジュール追加ボタンクリック時の処理
    this.logger.info('props', this.props);
    this.logger.info('state', this.state);
    this.setState({saveButtonDisabled: false});
    this.props.actions.addDeviceWateringSchedule();
  }

  remove(event, data, row, args) {
    // スケジュール削除ボタンクリック時の処理
    this.props.actions.removeDeviceWateringSchedule(row.row.id);
  }

  render() {
    // this.logger.log('render', this.props.deviceId);

    // テーブルのカラムレイアウト
    const columns = [{
        Header: 'ID',
        accessor: 'id',
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Name',
        accessor: 'name',
        Cell: EditableTable.createInputCell({
          formatter: new Formatter("none"),
          callback: this.update,
        })
      }, {
        Header: 'Start at',
        accessor: 'start_at',
        Cell: EditableTable.createInputCell({
          formatter: new Formatter("time"),
          callback: this.update,
        })
      }, {
        Header: 'Stop at',
        accessor: 'stop_at',
        Cell: EditableTable.createInputCell({
          formatter: new Formatter("time"),
          callback: this.update,
        })
      }, {
        Header: 'Amount',
        accessor: 'amount',
        Cell: EditableTable.createInputCell({
          formatter: new Formatter("decimal"),
          callback: this.update,
        })
      }, {
        Header: '-',
        accessor: 'remove',
        Cell: EditableTable.createButtonCell({
          icon: "remove",
          callback: this.remove,
        })
    }];

    return (
        <div className="ui container">
          <div className="item ui header">
            {/* <Button as='a' onClick={this.debug} >Debug</Button> */}
            <Button as='a' onClick={this.save} loading={this.state.loading} disabled={this.state.loading || this.state.saveButtonDisabled}>Save</Button>
            <Button as='a' onClick={(event, data) => {this.load()}} loading={this.state.loading} disabled={this.state.loading}>Reload</Button>
            <div className='ui piled segment'>
              <Button as='a' onClick={this.add} loading={this.state.loading} disabled={this.state.loading}>Add</Button>

              <EditableTable
                data={this.props.deviceWateringsSchedules}
                columns={columns}
              />

            </div>
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    selectedDeviceWateringsId: state.deviceWatering.selectedId,
    deviceWateringsSchedules: state.deviceWatering.schedules,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceWateringsSchedule);
