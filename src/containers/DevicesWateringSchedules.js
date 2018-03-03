import React from 'react'
import { Button } from 'semantic-ui-react';
import EditableTable from '../components/common/EditableTable'
import Logger from '../js/Logger'
import Formatter from '../js/formatter/Formatter'
import TimeFormatter from '../js/formatter/TimeFormatter'
import DecimalFormatter from '../js/formatter/DecimalFormatter'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesWatering';

class DevicesWateringSchedules extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DevicesWateringSchedules'});

    this.update = this.update.bind(this);
    this.load = this.load.bind(this);
    this.reload = this.reload.bind(this);
    this.save = this.save.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.enable = this.enable.bind(this);
    this.isDisableSaveButton = this.isDisableSaveButton.bind(this);
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
      this.props.actions.loadDevicesWateringSchedules(id);
    }
  }

  reload() {
    this.load(this.props.item.id);
  }

  update(event, data, row, args, changed) {
    // セル入力時の処理
    // this.logger.info('updated',
    //   'event', event,
    //   'data', data,
    //   'row', row,
    //   'args', args,
    //   'changed', changed,
    //   'props', this.props,
    //   );

    this.props.actions.updateDevicesWateringSchedule(
      changed.rowId,
      changed.columnId,
      changed.value,
      changed.error);
    this.setState({saveButtonDisabled: false});
  }

  save() {
    // セーブボタンクリック時の処理
    this.props.actions.saveDevicesWateringSchedules(
      this.props.item.id,
      this.props.records,
      this.props.changed);
  }

  add() {
    // スケジュール追加ボタンクリック時の処理
    this.props.actions.addDevicesWateringSchedule(this.props.item.id);
  }

  remove(event, data, row, args) {
    // スケジュール削除ボタンクリック時の処理
    this.props.actions.removeDevicesWateringSchedule(row.row.id);
  }

  enable(event, data, row, args) {
    // 有効無効チェックボックスクリック時の処理
    this.props.actions.updateDevicesWateringSchedule(row.row.id, row.column.id, data.checked);
    this.setState({saveButtonDisabled: false});
  }

  isDisableSaveButton() {
    // 変更されたデータがあるか判定
    return (0 === Object.keys(this.props.changed).length);
  }

  render() {
    // this.logger.log('render', this.props.deviceId);

    // テーブルのカラムレイアウト
    const columns = [{
        Header: 'ID',
        accessor: 'id',
        width: 32,
      }, {
        Header: 'On/Off',
        accessor: 'enable',
        width: 64,
        customCell: { type: 'checkbox', callback: this.enable }
      }, {
        Header: 'Name',
        accessor: 'name',
        customCell: { type: 'input', formatter: new Formatter(), callback: this.update }
      }, {
        Header: 'Start at',
        accessor: 'start_at',
        width: 100,
        customCell: { type: 'input', formatter: new TimeFormatter(), callback: this.update }
      // }, {
      //   Header: 'Stop at',
      //   accessor: 'stop_at',
      //   width: 100,
      //   customCell: { type: 'input', formatter: new TimeFormatter(), callback: this.update }
      }, {
        Header: 'Duration',
        accessor: 'duration',
        width: 80,
        customCell: { type: 'input', formatter: new DecimalFormatter(), callback: this.update }
      }, {
        Header: 'Amount',
        accessor: 'amount',
        width: 100,
        customCell: { type: 'input', formatter: new DecimalFormatter(), callback: this.update }
      }, {
        Header: '-',
        accessor: 'remove',
        width: 48,
        customCell: { type: 'button', icon: 'remove', callback: this.remove }
    }];

    return (
      <div className="ui container">
        <div className="item ui header">
          <Button as='a' onClick={this.save} loading={this.props.progress} disabled={this.props.progress || this.isDisableSaveButton()}>Save</Button>
          <Button as='a' onClick={this.reload} loading={this.props.progress} disabled={this.props.progress}>Reload</Button>
        </div>

        <Button as='a' onClick={this.add} loading={this.props.progress} disabled={this.props.progress}>Add</Button>

        <EditableTable
          data={this.props.records}
          columns={columns}
          loading={this.props.progress}
          defaultSorted={[{id: 'name', desc: false}]}
        />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    records: state.devicesWatering.get('schedules').toJS(),
    changed: state.devicesWatering.get('changed').toJS(),
    progress: state.devicesWatering.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesWateringSchedules);
