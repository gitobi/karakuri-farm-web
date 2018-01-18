import { Map } from 'immutable';
import Diff from 'immutablediff';
import Patch from 'immutablepatch';
import React from 'react'
import { Button, Input, Checkbox, Popup, List } from 'semantic-ui-react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Logger from '../../js/Logger'
import GtbUtils from '../../js/GtbUtils'

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './EditableTable.css'

export default class EditableTable extends React.Component {

  /**
   * @param  {data: [], columns: []} props
   */
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.filterOnChange = this.filterOnChange.bind(this);

    this.cellOnChange = this.cellOnChange.bind(this);
    this.cellOnBlur = this.cellOnBlur.bind(this);

    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.clearErrorMessage = this.clearErrorMessage.bind(this);
    this.isCellError = this.isCellError.bind(this);
    this.setCellError = this.setCellError.bind(this);
    this.clearCellError = this.clearCellError.bind(this);

    this.isFilterError = this.isFilterError.bind(this);
    this.isFilterErrors = this.isFilterErrors.bind(this);

    this.createColumns = this.createColumns.bind(this);
    this.createInputCell = this.createInputCell.bind(this);
    this.createButtonCell = this.createButtonCell.bind(this);
    this.createCheckboxCell = this.createCheckboxCell.bind(this);
    this.createRadioCell = this.createRadioCell.bind(this);
    this.createNormalCell = this.createNormalCell.bind(this);

    this.createRangeFilter = this.createRangeFilter.bind(this);
    this.createDateFilter = this.createDateFilter.bind(this);
    this.createNoFetchFilter = this.createNoFetchFilter.bind(this);

    this.createFetchFilterMethod = this.createFetchFilterMethod.bind(this);
    this.createClientFilterMethod = this.createClientFilterMethod.bind(this);

    this.onFetchData = this.onFetchData.bind(this);

    this.state = {
      // columns: props.columns,
      columns: this.createColumns(props.columns, props.filterable),
      errorMessage: {header: null, content: null},
      errorCells: {},
      lastFiltered: {},
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
  createColumns(params, filterable) {
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

      if (element.customFilter) {
        switch (element.customFilter.type) {
          case 'date':
            column.Filter = this.createDateFilter(element.customFilter);
            column.filterMethod = this.createFetchFilterMethod();
            column.db_column_type = "date";
            column.needFetch = true;
            break;
          case 'range':
            column.Filter = this.createRangeFilter(element.customFilter);
            column.filterMethod = this.createFetchFilterMethod();
            column.db_column_type = "numeric";
            column.needFetch = true;
            break;
          case 'no-fetch':
            column.Filter = this.createNoFetchFilter(element.customFilter);
            column.filterMethod = this.createClientFilterMethod();
            column.needFetch = false;
            break;
          default:
            break;
        }
      } else {
        if(filterable) {
          column.Filter = this.createNoFetchFilter({});
          column.filterMethod = this.createClientFilterMethod();
          column.needFetch = false;
        }
      }

      columns.push(column);
    });
    // this.logger.log('createColumns aft', columns);
    return columns;
  }

  filterOnChange(filterId, originalValue, newValue, formatter) {
    let row = {
      value: originalValue,
      row: {id: "_filter"},
      column: {id: filterId},
    }
    return this.cellOnChange({}, {}, row, {}, newValue, formatter);
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

  createFetchFilterMethod() {
    return (filter, row) => {return true};
  }

  createClientFilterMethod() {
    return (filter, row, column) => {
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
    }
  }

  /**
   * 日付フィルタを作成する
   */
  createDateFilter(args) {
    // var formatter = args.formatter;
    // var callback = args.callback;
    return (({filter, onChange, column}) => {
      return <List
        verticalAlign={"top"}
        style={{width: '100%'}}
        >

        <List.Item
          className="ui input mini"
          style={{
            width: '100%',
            display: 'block'
          }}
        >
          <DatePicker
            isClearable={true}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="L HH:mm"
            placeholderText={"min ~"}
            todayButton={"today"}
            selectsStart
            selected={filter && filter.value.min ? filter.value.min.local() : null}
            startDate={filter && filter.value.min ? filter.value.min : null}
            endDate={filter && filter.value.max ? filter.value.max : null}
            onChange={(moment) => {
              // console.log("onchange moment:", moment);
              let fv = filter && filter.value ? filter.value : {min: undefined, max: undefined};
              fv.min = moment ? moment : undefined;
              onChange(fv);
            }}
          />
        </List.Item>
        <List.Item
          className="ui input mini"
          style={{
            width: '100%',
            display: 'block'
          }}
        >
          <DatePicker
            isClearable={true}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="L HH:mm"
            placeholderText={"~ max"}
            todayButton={"today"}
            selectsEnd
            selected={filter && filter.value.max ? filter.value.max.local() : null}
            startDate={filter && filter.value.min ? filter.value.min : null}
            endDate={filter && filter.value.max ? filter.value.max : null}
            onChange={(moment) => {
              let fv = filter && filter.value ? filter.value : {min: undefined, max: undefined};
              fv.max = moment ? moment : undefined;
              onChange(fv);
            }}
          />
        </List.Item>
      </List>
    });
  }

  /**
   * レンジフィルタを作成する
   */
  createRangeFilter(args) {
    var formatter = args.formatter;
    // var callback = args.callback;
    return (({filter, onChange, column}) => {
      // console.log('createRangeFilter on method call!', filter);
      return <List
        verticalAlign={"top"}
        style={{width: '100%'}}
        >
        <List.Item>
          <Input
            style={{
              display: 'block',
              width: '100%'
            }}
            size='mini'
            placeholder={'min ~'}
            value={filter && filter.value.min ? filter.value.min : ''}
            error={this.isFilterError(column.id + "min")}
            onChange={((event, data) => {
              // console.log('onChange!', data, filter, column);
              let fv = filter && filter.value ? filter.value : {min: undefined, max: undefined};
              let changed = this.filterOnChange(
                column.id + "min",
                fv.min,
                data.value ? data.value : undefined,
                formatter);
              // console.log('formatted!', changed);
              fv.min = changed.value;
              onChange(fv);
            })}
            onBlur={((event, data) => {
            })}
          />
        </List.Item>
        <List.Item>
          <Input
            style={{
              display: 'block',
              width: '100%'
            }}
            size='mini'
            placeholder={'~ max'}
            value={filter && filter.value.max ? filter.value.max : ''}
            error={this.isFilterError(column.id + "max")}
            onChange={((event, data) => {
              // console.log('onChange!', data);
              let fv = filter && filter.value ? filter.value : {min: undefined, max: undefined};
              let changed = this.filterOnChange(
                column.id + "max",
                fv.max,
                data.value ? data.value : undefined,
                formatter);
              // console.log('formatted!', changed);
              fv.max = changed.value;
              onChange(fv);
            })}
            onBlur={((event, data) => {
            })}
          />
        </List.Item>
        </List>
    });

  }

  /**
   * DBフェッチを行わないクライアント完結のフィルタを作成する
   */
  createNoFetchFilter(args={}) {
    // var formatter = args.formatter;
    // var callback = args.callback;
    return (({filter, onChange, column}) => {
      return <Input
        style={{
          display: 'block',
          width: '100%'
        }}
        size='mini'
        value={filter && filter.value ? filter.value : ''}
        onChange={((event, data) => {
          onChange(data.value ? data.value : undefined);
        })}
      />
    });
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
   * 対象フィルタでエラーが発生しているかを確認する
   * @param  {[type]}  row [description]
   * @return {Boolean}     [description]
   */
  isFilterError(filterId) {
    // this.logger.log("errorFilter:", "_filter" + filterId, this.state.errorCells, this.state.errorCells["_filter" + filterId]);
    return this.state.errorCells["_filter" + filterId] ? true : false;
  }

  /**
   * フィルタのいずれかでエラーが発生しているかを確認する
   * @param  {[type]}  row [description]
   * @return {Boolean}     [description]
   */
  isFilterErrors() {
    // this.logger.log("call on isFilterErrors", this.state.errorCells);
    return Object.keys(this.state.errorCells).some((key) => {
      if (key.startsWith("_filter")) {
        // this.logger.log("hit on isFilterErrors", key, this.state.errorCells[key], this.state.errorCells[key] ? true : false);
        return this.state.errorCells[key] ? true : false;
      }
      return false;
    });
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
    // this.logger.log("errorCells:", errorCells);
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

  onFetchData(state, instance) {
    // this.logger.log("onFetchData", state.filtered);

    // フィルタにエラーがある場合はフェッチを行わない
    if (this.isFilterErrors()) {
      // this.logger.log("filter error!");
      return;
    }

    //変更されたfilterの確認
    // let lastFiltered = this.state.lastFiltered;
    let needFetch = false;
    let beforeFiltered = Map(this.state.lastFiltered);
    let afterFiltered = Map({});
    state.filtered.forEach((filter) => { afterFiltered = afterFiltered.set(filter.id, filter) });
    // TODO ネストされたオブジェクトの値が変更されていることまでしか検知出来ないが
    // どのカラムが変更されたかは判断できるため、とりあえずこれで行く
    let diffPatch = Diff(beforeFiltered, afterFiltered);
    let diffObject = Patch(Map({}), diffPatch).toJS();
    // this.logger.log("onFetchData diff", diffPatch.toJS());
    Object.keys(diffObject).forEach((columnId) => {
      let column = GtbUtils.find(state.columns, "accessor", columnId);
      // this.logger.log("onCompare! => needFetch", column.needFetch);
      needFetch |= column.needFetch;
    });
    // 前回フィルタを更新
    this.setState({lastFiltered: afterFiltered.toJS()});

    if (needFetch) {
      ///// dbフェッチ
      // 必要なパラメータだけを作成する
      let filtered = state.filtered.filter((filter) => {
        return filter
          && filter.value
          && Object.keys(filter.value).some((key) => {return undefined !== filter.value[key]});
      }).map((filter) => {
        let copy = Object.assign({}, filter);
        let column = GtbUtils.find(state.columns, "accessor", copy.id);
        copy.needFetch = column.needFetch;
        return copy;
      }).filter((filter) => {
        return filter.needFetch;
      });
      // this.logger.log("=> onFetchData", state.filtered);

      if (this.props.onFetchData) {
        let params = {
          pageSize: state.pageSize,
          page: state.page,
          sorted: state.sorted,
          filtered: filtered,
        }
        // this.logger.log("call onFetchData", params);
        this.props.onFetchData(params);
      }
    }
  }

  /**
   * TODO テーブル描画 必要に応じて外部から設定できるように修正していく
   */
  render() {
    // this.logger.log('render', this.props, this.state);

    // ReactTable
    const table = (
      <div>
        <ReactTable
          className="-striped -highlight"
          data={this.props.data}
          columns={this.state.columns}
          loading={this.props.loading}
          defaultPageSize={12}
          minRows={3}
          filterable={this.props.filterable
            ? this.props.filterable
            : false
          }
          onFetchData={this.onFetchData}
          sortable={this.props.sortable}
          defaultSorted={this.props.defaultSorted
              ? this.props.defaultSorted
              : [{id: 'id', desc: false}]}

          getTheadFilterThProps={() => { return { style: { position: "inherit", overflow: "inherit" } } }}
        />
      </div>
    );

    // エラー発生時のポップアップを表示するため、Popupでwrapする。
    return (
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
    );
  }

}
