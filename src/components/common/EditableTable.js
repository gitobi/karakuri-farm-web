import React from 'react'
import { Button, Input, Checkbox } from 'semantic-ui-react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Logger from '../../js/Logger'

export default class EditableTable extends React.Component {

  /**
   * @param  {data: [], columns: []} props
   */
  constructor(props) {
    super(props);
    this.state = {
      // enableSort: true,
      // defaultSortMethod: this.enableSortMethod(),
      sorted: props.defaultSorted
                ? this.props.defaultSorted
                : [{id: 'id', desc: false}],
      sortable: true,
    };

    this.logger = new Logger({prefix: 'EditableTable'});
    this.update = this.update.bind(this);
    this.debug = this.debug.bind(this);
    this.onSortedChange = this.onSortedChange.bind(this);
    // this.toggleEnableSort = this.toggleEnableSort.bind(this);
    this.disableSort = this.disableSort.bind(this);
    this.enableSort = this.enableSort.bind(this);
    this.setSortable = this.setSortable.bind(this);
    this.sortable = this.sortable.bind(this);
    this.customSortMethod = this.customSortMethod.bind(this);
  }

  update(event, data, row, args) {
    this.logger.info('updated',
      'event', event,
      'data', data,
      'row', row,
      'args', args,
      'props', this.props,
      'state', this.state);
  }

  debug(args) {
    this.logger.info('debug',
      'args', args,
      'props', this.props,
      'state', this.state);
  }

  disableSort() {
    this.logger.info('disableSort',
      'props', this.props,
      'state', this.state);
    this.setSortable(false);
  }

  enableSort() {
    this.setSortable(true);
  }


  // toggleEnableSort() {
  //   var enableSort = !this.state.enableSort;
  //   var defaultSortMethod = this.state.enableSort
  //     ? this.enableSortMethod()
  //     : this.disableSortMethod()
  //     ;

  //   this.logger.log('切り替え', enableSort, defaultSortMethod);
  //   this.setState({
  //     enableSort: enableSort,
  //     defaultSortMethod: defaultSortMethod,
  //   });
  // }

  setSortable(enable) {
    // var defaultSortMethod = enable
    //   ? this.enableSortMethod()
    //   : this.disableSortMethod()
    //   ;

    var backSorted = [];
    var sorted = this.state.backSorted;
    if (!enable) {
      backSorted = this.state.sorted;
      sorted = [{id: '_viewIndex', desc: false}];
    }


    this.setState({
      sortable: enable,
      sorted: sorted,
      backSorted: backSorted,
      // defaultSortMethod: defaultSortMethod,
    });
  }


  onSortedChange(newSorted, column, shiftKey) {
    this.logger.log(this.state.sorted, '->', newSorted);
    this.setState({
      sorted: newSorted,
      sortable: true,
    });
  }

  customSortMethod(a, b, desc, a1, a2) {
    a = (a === null || a === undefined) ? -Infinity : a
    b = (b === null || b === undefined) ? -Infinity : b
    a = a === 'string' ? a.toLowerCase() : a
    b = b === 'string' ? b.toLowerCase() : b
    // if ((typeof a === 'string') && (a.match(/Schedule/gi))) {
    if ((typeof a === 'string')) {
      console.log("called customSortMethod", a, b, desc, this.state.sortable, a1, a2);
      // this.debug('bbb');
    }

    if (!this.state.sortable) {
      console.log("called customSortMethod returned 0");
      return 0;
    }

    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  }

  enableSortMethod() {
    return (a, b, desc) => {
      a = (a === null || a === undefined) ? -Infinity : a
      b = (b === null || b === undefined) ? -Infinity : b
      a = a === 'string' ? a.toLowerCase() : a
      b = b === 'string' ? b.toLowerCase() : b
      console.log("called enable", a, b, desc, this.state.sortable)
      if (a > b) {
        return 1
      }
      if (a < b) {
        return -1
      }
      return 0
    }
  }

  disableSortMethod() {
    return (a, b, desc) => {
      a = (a === null || a === undefined) ? -Infinity : a
      b = (b === null || b === undefined) ? -Infinity : b
      a = a === 'string' ? a.toLowerCase() : a
      b = b === 'string' ? b.toLowerCase() : b
      console.log("called disable", a, b, desc)
      return 0
    }
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
  static createNormalCell() {
    return ((row) => {
      return (
        <div style={{
          display: 'table',
          textAlign: 'center',
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

  sortable() {
    // ソート可否ボタンクリック時の処理
    this.logger.log(this.state.sortable, '->', !this.state.sortable);
    this.setSortable(!this.state.sortable)
    // this.setState({sortable: !this.state.sortable});
  }

  /**
   * TODO テーブル描画 必要に応じて外部から設定できるように修正していく
   */
  render() {
    // this.logger.log('render', this.props, this.state);
    return (
      <div>
        <Button as='a' onClick={this.debug}>debug</Button>
        <Button as='a' onClick={this.sortable}>ソート切り替え</Button>
        <Checkbox toggle checked={this.state.sortable} onClick={this.debug} label='Sortable' />
        <ReactTable
            className="-striped -highlight"
            defaultSortMethod={this.customSortMethod}
            data={this.props.data}
            columns={this.props.columns}
            loading={this.props.loading}
            defaultPageSize={12}
            minRows={3}
            sortable={true}
            defaultSorted={[]}
            sorted={this.state.sorted}
            onSortedChange={this.onSortedChange}
        />
      </div>
    );
  }

}
