import React from 'react'
import { Button, Input } from 'semantic-ui-react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Logger from '../js/Logger'

export default class EditableTable extends React.Component {

  /**
   * 注意:
   * このクラスに渡されるprops.columnsは、参照を切ってはいけないっぽいので、
   * 親クラスでもprops/const相当の固定値でなければ駄目っぽい。
   * いろいろ試したけどちょっとわからん
   *
   * @param  {data: [], columns: []} props
   */
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'EditableTable'});
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
    return (
      <ReactTable
          className="-striped -highlight"
          data={this.props.data}
          columns={this.props.columns}
          defaultPageSize={10}
          minRows={2}
          defaultSorting={[{
            id: 'Name',
            desc: false
          }]}
      />
    );
  }

}
