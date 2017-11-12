import React from 'react'
import { Button, Input } from 'semantic-ui-react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Logger from '../../js/Logger'

export default class EditableTable extends React.Component {

  /**
   * @param  {data: [], columns: []} props
   */
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'EditableTable'});
    this.update = this.update.bind(this);
  }

  update(event, data, row, args) {
    // this.logger.info('updated',
    //   'event', event,
    //   'data', data,
    //   'row', row,
    //   'args', args,
    //   'props', this.props,
    //   'state', this.state);
  }

  /**
   * 入力セルを作成する
   * @param  {formatter: Formatter, callback: ((event, data, row, args) => {})} args
   * @return {((row) => {})}
   */
  static createInputCell(args) {
    var formatter = args.formatter;
    var callback = args.callback;
    return ((row) => {
      return <Input
        fluid
        placeholder={formatter.placeholder}
        value={row.value || ''}
        onChange={((event, data) => {
          if (callback) {
            callback(event, data, row, args);
          }
        })}
      />
    })
  }

  /**
   * ボタンセルを作成する
   * @param  {icon: String, callback: ((event, data, row, args) => {})} args
   * @return {((row) => {})}
   */
  static createButtonCell(args) {
    var icon = args.icon;
    var callback = args.callback;
    return ((row) => {
      return <Button
        icon={icon}
        onClick={((event, data) => {
          // this.props.onUpdateFromButton(row.row.id, row.index, row.column.id);
          if (callback) {
            callback(event, data, row, args);
          }
        })}
      />
    })
  }

  /**
   * 通常セルを作成する
   * @return {((row) => {})}
   */
  static createNormalCell() {
    return ((row) => {
      return <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#dadada',
              borderRadius: '2px'
          }}>
            <div>{row.value}</div>
          </div>
    })
  }

  /**
   * TODO テーブル描画 必要に応じて外部から設定できるように修正していく
   */
  render() {
    // this.logger.info('render', this.props, this.state);
    return (
      <ReactTable
          className="-striped -highlight"
          data={this.props.data}
          columns={this.props.columns}
          defaultPageSize={10}
          minRows={2}
          sortable={false}
          defaultSorted={[{
            id: 'id',
            desc: false
          }]}
      />
    );
  }

}
