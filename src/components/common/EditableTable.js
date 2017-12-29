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
      return (
        <div style={{
          display: 'table',
          textAlign: 'center',
          verticalAlign: 'middle',
          width: '100%',
          height: '100%',
        }}>
          <Button
          icon={icon}
          onClick={((event, data) => {
            // this.props.onUpdateFromButton(row.row.id, row.index, row.column.id);
            if (callback) {
              callback(event, data, row, args);
            }
          })}
          />
        </div>
      )
    })
  }

  /**
   * 通常セルを作成する
   * @return {((row) => {})}
   */
  static createNormalCell(args) {
    var divStyle = args && args.divStyle ? args.divStyle : new Map();
    return ((row) => {
      return (
        <div style={{
          display: 'table',
          textAlign: divStyle.textAlign ? divStyle.textAlign : 'center',
          verticalAlign: 'middle',
          width: '100%',
          height: '100%',
        }}>
          <p style={{
            verticalAlign: 'middle',
            display: 'table-cell',
          }}>
            {row.value}
          </p>
        </div>
      );
    })
  }

  /**
   * TODO テーブル描画 必要に応じて外部から設定できるように修正していく
   */
  render() {
    // this.logger.log('render', this.props, this.state);
    return (
      <div>
        <ReactTable
            className="-striped -highlight"
            data={this.props.data}
            columns={this.props.columns}
            loading={this.props.loading}
            defaultPageSize={12}
            minRows={3}
            sortable={this.props.sortable}
            defaultSorted={this.props.defaultSorted
                ? this.props.defaultSorted
                : [{id: 'id', desc: false}]}
        />
      </div>
    );
  }

}
