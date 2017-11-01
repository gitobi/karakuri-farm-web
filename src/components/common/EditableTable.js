import React from 'react'
import { Button, Input } from 'semantic-ui-react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Logger from '../../js/Logger'
import Formatter from '../../js/Formatter'

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

    // this.createColumns = this.createColumns.bind(this);
    // this.createCell = this.createCell.bind(this);
    this.createInputCell = this.createInputCell.bind(this);
    this.createButtonCell = this.createButtonCell.bind(this);
    this.createNormalCell = this.createNormalCell.bind(this);
    this.update = this.update.bind(this);
    // this.applyCellStyle = this.applyCellStyle.bind(this);

    this.state = ({
      // data: props.data,
      // columns: this.createColumns(props.columns),
      // states: 'constructor',
    });
  }

  static INPUT = '@ET/INPUT';
  static BUTTON = '@ET/BUTTON';
  static NORMAL = '@ET/NORMAL';

  createColumns(original) {
    var columns = [];
    original.forEach((object) => {

      var column = {
        Header: object.Header,
        accessor: object.accessor,
      };

      if (object.cell) {
        column.Cell = this.createCell(object.cell);
      } else {
        column.Cell = object.Cell;
      }

      columns.push(column);
    });
    return columns;
  }

  createCell(object) {
    this.logger.info('createCell', object);
    switch (object.type) {
      case EditableTable.INPUT:
        return this.createInputCell({
          formatter: object.formatter,
          callback: object.callback,
        });

      case EditableTable.BUTTON:
        return this.createButtonCell({
          formatter: object.formatter,
          callback: object.callback,
        });

      case EditableTable.NORMAL:
        return this.createNormalCell({
          formatter: object.formatter,
          callback: object.callback,
        });

      default:
        return object;
    }
  }

  // componentWillMount() {
  //   const columns = Object.assign([], this.props.columns);
  //   this.setState({
  //     columns: columns,
  //     states: 'willMount',
  //   });
  //   this.logger.info('willMount', this.props, this.state);
  //   // this.applyCellStyle();
  // }

  componentWillReceiveProps(nextProps) {
    // const columns = Object.assign([], nextProps.columns);
    // this.setState({
    //   columns: columns,
    //   states: 'willReciveProps',
    // });
    // this.logger.info('willReciveProps', this.props, '->', nextProps, this.state);
    // this.applyCellStyle();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   this.logger.info('shouldComponentUpdate : props', this.props, '->', nextProps);
  //   this.logger.info('shouldComponentUpdate : state', this.state, '->', nextState);
  //   return true;
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   // One possible fix...
  //   let height = ReactDOM.findDOMNode(this).offsetHeight;
  //   if (this.state.height !== height ) {
  //     this.setState({ internalHeight: height });
  //   }
  // }

  // applyCellStyle() {
  //   this.logger.info('apply', this.props, this.state);
  //   var columns = this.state.columns;
  //   columns.forEach((column) => {
  //     if ('input' === column.cell) {
  //       column.Cell = this.createInputCell({
  //         formatter: new Formatter("time"),
  //         callback: this.update,
  //         })
  //       column.Header = "aaa";
  //     }
  //   });
  //   this.setState({
  //     columns: columns,
  //     states: 'apply',
  //   });

  // }

  update(event, data, row, args) {
    this.logger.info('updated',
      'event', event,
      'data', data,
      'row', row,
      'args', args,
      'props', this.props,
      'state', this.state);

    // var d = this.state.data;
    // d[row.index][row.column.id] = data.value;
    // this.setState({data: d});
  }

  /**
   * 入力セルを作成する
   * @param  {formatter: Formatter, callback: ((event, data, row, args) => {})} args
   * @return {((row) => {})}
   */
  createInputCell(args) {
    var formatter = args.formatter;
    var callback = args.callback;
    return ((row) => {
      // console.log(row);
      // var value = row.value;
      return <Input
        fluid
        placeholder={formatter.placeholder}
        onChange={((event, data) => {
          this.update(event, data, row, args);
          if (callback) {
            callback(event, data, row, args);
          }
        })}
        // value={this.props.data[row.index][row.column.id]}
        value={row.value}
      />
    })
  }

  /**
   * ボタンセルを作成する
   * @param  {icon: String, callback: ((event, data, row, args) => {})} args
   * @return {((row) => {})}
   */
  createButtonCell(args) {
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
  createNormalCell() {
    return ((row) => {
      return <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#dadada',
              borderRadius: '2px'
          }}>
            <div>{this.props.data[row.index][row.column.id]}</div>
          </div>
    })
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
    this.logger.info('render', this.props, this.state);
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
