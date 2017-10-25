import React from 'react'
import { Button } from 'semantic-ui-react';
import EditableTable from './common/EditableTable'
import Logger from './js/Logger'
import GtbUtils from './js/GtbUtils'
import Formatter from './js/Formatter'

export default class DeviceWateringsSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'Schedule'});
    this.state = {
      text: "none",
      schedules: [],
      saveButtonDisabled: true,
      changedSchedules: {},
      loading: false,
    };

    this.tmpCallback = this.tmpCallback.bind(this);
    this.debug = this.debug.bind(this);
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
    this.add = this.add.bind(this);
  }

  tmpCallback(event, data, row, args) {
    // this.props.onUpdateFromEditer(row.row.id, row.index, row.column.id, data.value);
    this.logger.info(event, data, row, args);

    // TODO 変更された値を フォーマッティングしつつ this.state.schedules にツッコミ、
    // かつ、変更点をBastetに送れるように何とかする
    // 後、削除ボタンを押されたときにいい感じに削除する
  }

  debug() {
    this.logger.info(this.state.columns);
  }

  componentWillMount() {
    // 初回ページ表示時のロード
    // this.logger.log('componentWillMount', this.props, this.state);
    this.load();
  }

  componentWillReceiveProps(nextProps) {
    // props.deviceIdが更新された場合のロード
    // this.logger.log('componentWillReceiveProps', this.props, nextProps);
    if (this.props.deviceId !== nextProps.deviceId) {
      this.load(nextProps.deviceId);
    }
  }

  load(deviceId) {
    // TODO データのload

    if (!deviceId) {
      deviceId = this.props.deviceId;
    }

    this.setState({loading: true});
    var list = this.state.schedules;
    list.splice(0, list.length);
    if (0 === list.length) {
      list.push({
        id: deviceId + "1",
        name: deviceId + " schedule 1",
        start_at: "07:00:00",
        stop_at: "07:00:0" + deviceId,
        amount: "100",
      });
      list.push({
        id: deviceId + "2",
        name: deviceId + " schedule 2",
        start_at: "08:00:00",
        stop_at: "08:00:0" + deviceId,
        amount: "200",
      });
      this.setState({schedules: list});
    }
    this.setState({loading: false});
  }

  save() {
    // TODO データのセーブ
    this.setState({loading: true});
    this.setState({saveButtonDisabled: true});
    this.setState({loading: false});
    this.setState({changedSchedules: {}});
  }

  add() {
    // 一時IDを発行する
    var tmpId = GtbUtils.getTmpId(this.state.schedules.map((row) => {return row.id}));

    // 行を作成して追加
    var list = this.state.schedules;
    var row = {
      id: tmpId,
      device_id: this.props.deviceId,
    }
    list.push(row);
    this.setState({saveButtonDisabled: false});
  }


  render() {
    // this.logger.log('render', this.props.deviceId);

    const columns = [{
        Header: 'ID',
        accessor: 'id',
        Cell: EditableTable.createNormalCell()
      }, {
        Header: 'Name',
        accessor: 'name',
        Cell: EditableTable.createInputCell({
          formatter: new Formatter("none"),
          callback: this.tmpCallback,
        })
      }, {
        Header: 'Start at',
        accessor: 'start_at',
        Cell: EditableTable.createInputCell({
          formatter: new Formatter("time"),
          callback: this.tmpCallback,
         })
      }, {
        Header: 'Stop at',
        accessor: 'stop_at',
        Cell: EditableTable.createInputCell({
          formatter: new Formatter("time"),
          callback: this.tmpCallback,
        })
      }, {
        Header: 'Amount',
        accessor: 'amount',
        Cell: EditableTable.createInputCell({
          formatter: new Formatter("decimal"),
          callback: this.tmpCallback,
        })
      }, {
        Header: '-',
        accessor: 'remove',
        Cell: EditableTable.createButtonCell({
          icon: "remove",
          callback: this.tmpCallback,
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
                data={this.state.schedules}
                columns={columns}
              />

            </div>
          </div>
        </div>
    );
  }
}
