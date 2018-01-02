import React from 'react'
import { Button, Input, Checkbox, Popup } from 'semantic-ui-react';
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
    this.setError = this.setError.bind(this);
    this.clearError = this.clearError.bind(this);
    this.createColumns = this.createColumns.bind(this);
    this.createInputCell2 = this.createInputCell2.bind(this);
    this.state = {
      // columns: props.columns,
      columns: this.createColumns(props.columns),
      error: {header: null, message: null},
    };
  }

  createColumns(params) {
    this.logger.log('createColumns bef', params);
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
        column.Cell = this.createInputCell2({
          formatter: element.customCell.formatter,
          callback: element.customCell.callback,
        });
      }
      columns.push(column);
    });
    this.logger.log('createColumns aft', columns);
    return columns;
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
  createInputCell2(args) {
    let formatter = args.formatter;
    let callback = args.callback;
    let errors = {};
    return ((row) => {
      return <Input
        fluid
        placeholder={formatter.placeholder}
        value={(row.value || '')}
        error={errors[row.row.id] ? true : false}
        onChange={((event, data) => {

          console.log('inputCell.onChange:',
            'event', event,
            'data', data,
            'row', row,
            'args', args
            );

          data.value = formatter.onChange(row.value, data.value);
          data.error = formatter.error;
          errors[row.row.id] = data.error ? true : false;
          console.log('errors', errors);
          if (callback) {
            callback(event, data, row, args);
          }
        })}
        onBlur={((event, data) => {
          data.value = row.value;

          console.log('inputCell.onBlur:',
            'event', event,
            'data', data,
            'row', row,
            'args', args
            );

          data.value = formatter.onBlur(row.value, data.value);
          data.error = formatter.error;
          if (callback) {
            callback(event, data, row, args);
          }
        })}
      />
    })
  }

  /**
   * 入力セルを作成する
   * @param  {formatter: Formatter, callback: ((event, data, row, args) => {})} args
   * @return {((row) => {})}
   */
  static createInputCell(args) {
    let formatter = args.formatter;
    let callback = args.callback;
    let errors = {};
    return ((row) => {
      return <Input
        fluid
        placeholder={formatter.placeholder}
        value={(row.value || '')}
        error={errors[row.row.id] ? true : false}
        onChange={((event, data) => {

          console.log('inputCell.onChange:',
            'event', event,
            'data', data,
            'row', row,
            'args', args
            );

          data.value = formatter.onChange(row.value, data.value);
          data.error = formatter.error;
          errors[row.row.id] = data.error ? true : false;
          if (callback) {
            callback(event, data, row, args);
          }
        })}
        onBlur={((event, data) => {
          data.value = row.value;

          console.log('inputCell.onBlur:',
            'event', event,
            'data', data,
            'row', row,
            'args', args
            );

          data.value = formatter.onBlur(row.value, data.value);
          data.error = formatter.error;
          errors[row.row.id] = data.error ? true : false;
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
   * チェックボックスセルを作成する
   * @param  {label: String, callback: ((event, data, row, args) => {})} args
   * @return {((row) => {})}
   */
  static createCheckboxCell(args) {
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

  clearError() {
    this.setError(null, null);
  }
  setError(header, message) {
    let error = this.state.error;
    error.header = header;
    error.message = message;
    this.setState({error: error});
  }

  /**
   * TODO テーブル描画 必要に応じて外部から設定できるように修正していく
   */
  render() {
    // this.logger.log('render', this.props, this.state);

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

    return (
      <Popup
        trigger={table}
        wide='very'
        size='large'
        inverted
        on='click'
        hideOnScroll
        position='top center'
        header={this.state.error.header}
        content={this.state.error.message}
        open={(this.state.error.header || this.state.error.message) ? true : false}
      />
    );
  }

}
