import React from 'react'
import {Segment, Button, Input, Checkbox, Popup, List, Divider} from 'semantic-ui-react';

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import Logger from '../../js/Logger'
import Header from '../../components/part/Header'

export default class EditableTable extends React.Component {

  /**
   * @param  {data: [], columns: []} props
   */
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.cellOnChange = this.cellOnChange.bind(this);
    this.cellOnBlur = this.cellOnBlur.bind(this);

    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.clearErrorMessage = this.clearErrorMessage.bind(this);
    this.isCellError = this.isCellError.bind(this);
    this.setCellError = this.setCellError.bind(this);
    this.clearCellError = this.clearCellError.bind(this);

    this.createColumns = this.createColumns.bind(this);
    this.createInputCell = this.createInputCell.bind(this);
    this.createButtonCell = this.createButtonCell.bind(this);
    this.createCheckboxCell = this.createCheckboxCell.bind(this);
    this.createRadioCell = this.createRadioCell.bind(this);
    this.createNormalCell = this.createNormalCell.bind(this);

    this.state = {
      // columns: props.columns,
      columns: this.createColumns(props.columns),
      errorMessage: {header: null, content: null},
      errorCells: {},
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    if ((this.props.data && nextProps.data)
      && (this.props.data !== nextProps.data)) {
      // props.dataが変更された場合はエラーセルを設定し直す
      this.clearCellError();
      nextProps.data.forEach((element, index, array) => {
        if (element._errors) {
          // this.logger.log('each', element)
          Object.keys(element._errors).forEach((column) => {
            let error = element._errors[column];
            let row = {
              row: {id: element.id},
              column: {id: column},
            }
            this.setCellError(row, error);
          });
        }
      });
    }
    // this.logger.log('componentWillReceiveProps', 'nextProps', nextProps);
  }

  /**
   * ReactTableのColumnsに準拠するオブジェクトを作成する。
   */
  createColumns(params) {
    // this.logger.log('createColumns bef', params);
    let columns = [];
    params.forEach((element, index, array) => {
      let column = {
        Header: element.Header,
        accessor: element.accessor,
      };
      if (element.width) {
        column.width = element.width;
      }
      if (element.Cell) {
        column.Cell = element.Cell;
      }
      if (element.customCell) {
        switch (element.customCell.type) {
          case 'input':
            column.Cell = this.createInputCell(element.customCell);
            break;
          case 'button':
            column.Cell = this.createButtonCell(element.customCell);
            break;
          case 'checkbox':
            column.Cell = this.createCheckboxCell(element.customCell);
            break;
          case 'radio':
            column.Cell = this.createRadioCell(element.customCell);
            break;
          default:
            column.Cell = this.createNormalCell(element.customCell);
            break;
        }
      } else {
        column.Cell = this.createNormalCell(element.customCell);
      }

      columns.push(column);
    });
    // this.logger.log('createColumns aft', columns);
    return columns;
  }

  /**
   * 入力タイプのセルの値が変更された際にフォーマッターを呼び出す。
   */
  cellOnChange(event, data, row, args, value, formatter) {
    // this.logger.info('cellOnChange',
    //   'event', event,
    //   'data', data,
    //   'row', row,
    //   'args', args,
    //   'value', value,
    //   'formatter', formatter,
    //   'props', this.props,
    //   'state', this.state
    // );

    let changed = {
      rowId: row.row.id,
      columnId: row.column.id,
      newValue: value,
      originalValue: row.value,
      value: value,
    };

    if (formatter) {
      let returnMap = formatter.onChange(row.value, value);
      this.setCellError(row, returnMap.error);
      returnMap.error
        ? this.setErrorMessage('入力エラー', returnMap.error)
        : this.clearErrorMessage()
        ;
      changed.value = returnMap.value;
      changed.error = returnMap.error;
      changed.valid = returnMap.valid;
    }

    return changed;
  }

  /**
   * 入力タイプのセルからフォーカスが外れた際にフォーマッターを呼び出す。
   */
  cellOnBlur(event, data, row, args, value, formatter) {
    // this.logger.info('cellOnChange',
    //   'event', event,
    //   'data', data,
    //   'row', row,
    //   'args', args,
    //   'value', value,
    //   'formatter', formatter,
    //   'props', this.props,
    //   'state', this.state
    // );

    let changed = {
      rowId: row.row.id,
      columnId: row.column.id,
      newValue: value,
      originalValue: row.value,
    };

    if (formatter) {
      let returnMap = formatter.onBlur(value);
      this.setCellError(row, returnMap.error);
      this.clearErrorMessage();
      changed.value = returnMap.value;
      changed.error = returnMap.error;
      changed.valid = returnMap.valid;
    }

    return changed;
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
      // console.log('createInputCell on method call!', row.index, row.column.id);
      return <Input
        fluid
        placeholder={formatter.placeholder}
        value={(row.value || '')}
        error={this.isCellError(row)}
        onChange={((event, data) => {
          let changed = this.cellOnChange(event, data, row, args, data.value, formatter);
          if (callback) {
            callback(event, data, row, args, changed);
          }
        })}
        onBlur={((event, data) => {
          this.cellOnBlur(event, data, row, args, row.value, formatter);
        })}
      />
    });
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
   * チェックボックスセルを作成する
   * @param  {label: String, callback: ((event, data, row, args) => {})} args
   * @return {((row) => {})}
   */
  createCheckboxCell(args) {
    var label = args.label;
    var callback = args.callback;
    return ((row) => {
      return (
        <div
           style={{
            display: 'table',
            verticalAlign: 'middle',
            textAlign: 'center',
            width: "100%",
            height: '100%',
          }}
        >
          <span
            style={{
              verticalAlign: 'middle',
              display: 'table-cell',
            }}
          >
            <Checkbox
              as='span'
              label={label ? label : null}
              checked={row.value}
              onChange={((event, data) => {
                if (callback) {
                  callback(event, data, row, args);
                }
              })}
            />
          </span>
        </div>
      )
    })
  }

  /**
   * ラジオセルを作成する
   * @param  {label: String, callback: ((event, data, row, args) => {})} args
   * @return {((row) => {})}
   */
  createRadioCell(args) {
    let label = args.label;
    let callback = args.callback;

    return ((row) => {
      return (
        <div
           style={{
            display: 'table',
            verticalAlign: 'middle',
            textAlign: 'center',
            width: "100%",
            height: '100%',
          }}
        >
          <span
            style={{
              verticalAlign: 'middle',
              display: 'table-cell',
            }}
          >
            <Checkbox
              as='span'
              toggle
              label={label ? label : null}
              checked={row.value}
              onChange={((event, data) => {
                if (callback) {
                  this.props.data.forEach((datum) => {
                    let tmpRow = {
                      row: {id: datum.id},
                      column: {id: row.column.id},
                    };
                    let tmpData = {
                      checked: data.checked
                        ? row.row.id === datum.id
                        : data.checked,
                    };
                    callback(event, tmpData, tmpRow, args);
                  });
                }
              })}
            />
          </span>
        </div>
      )
    })
  }

  /**
   * 通常セルを作成する
   * @return {((row) => {})}
   */
  createNormalCell(args) {
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
   * エラーメッセージを設定する
   * @param {[type]} header  [description]
   * @param {[type]} content [description]
   */
  setErrorMessage(header, content) {
    let error = this.state.errorMessage;
    error.header = header;
    error.content = content;
    this.setState({errorMessage: error});
  }

  /**
   * エラーメッセージを削除する
   * @return {[type]} [description]
   */
  clearErrorMessage() {
    this.setErrorMessage(null, null);
  }

  /**
   * 対象セルでエラーが発生しているかを確認する
   * @param  {[type]}  row [description]
   * @return {Boolean}     [description]
   */
  isCellError(row) {
    return this.state.errorCells[row.row.id + row.column.id] ? true : false;
  }

  /**
   * 対象セルにエラーを設定する
   * @param {[type]} row   [description]
   * @param {[type]} error [description]
   */
  setCellError(row, error) {
    // this.logger.log('setCellError', row, error);
    let errorCells = this.state.errorCells;
    errorCells[row.row.id + row.column.id] = error ? true : false;
    this.setState({errorCells: errorCells});
  }

  /**
   * 全てのセルのエラーを削除する
   * @return {[type]} [description]
   */
  clearCellError() {
    let errorCells = this.state.errorCells;
    for(var key in errorCells){
        delete errorCells[key];
    }
    this.setState({errorCells: errorCells});
  }

  /**
   * TODO テーブル描画 必要に応じて外部から設定できるように修正していく
   */
  render() {
    // this.logger.log('render', this.props, this.state);

    // record size
    const children = (() => {
      if (this.props.children) {
        return (
          <div>
            <Divider />
            {this.props.children}
          </div>
        );
      }
    })();

    // ReactTable
    const table = (
      <div>
        <ReactTable
          className="-striped -highlight"
          data={this.props.data}
          columns={this.state.columns}
          loading={this.props.loading}
          pageSizeOptions={this.props.pageSizeOptions
            ? this.props.pageSizeOptions
            : [5, 10, 20, 25, 50, 100]
          }
          defaultPageSize={this.props.defaultPageSize
            ? this.props.defaultPageSize
            : 20
          }
          minRows={10}
          filterable={this.props.filterable
            ? this.props.filterable
            : false
          }
          defaultFilterMethod={(filter, row, column) => {
            const id = filter.pivotId || filter.id
            if (row[id] === undefined) {
              return true;
            }
            try {
              const regexp = new RegExp(filter.value);
              return String(row[id]).match(regexp);
            } catch(e) {
              return -1 === String(row[id]).indexOf(filter.value) ? false : true;
            }
          }}
          sortable={this.props.sortable}
          defaultSorted={this.props.defaultSorted
              ? this.props.defaultSorted
              : [{id: 'id', desc: false}]}
        />
      </div>
    );

    // エラー発生時のポップアップを表示するため、Popupでwrapする。
    return (
      <Segment loading={this.props.loading}>
        <Header label={this.props.label}/>

        <Popup
          trigger={table}
          wide='very'
          size='large'
          inverted
          on='click'
          hideOnScroll
          position='top center'
          open={(this.state.errorMessage.header || this.state.errorMessage.content) ? true : false}
        >
          <Popup.Header>{this.state.errorMessage.header}</Popup.Header>
          <Popup.Content>
            {(() => {
              if (this.state.errorMessage.content instanceof Array) {
                return <List items={this.state.errorMessage.content} />
              } else {
                return this.state.errorMessage.content;
              }
            })()}
          </Popup.Content>
        </Popup>

        {children}

      </Segment>
    );
  }

}
