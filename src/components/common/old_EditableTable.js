import React from 'react'
import { Button, Input } from 'semantic-ui-react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Logger from '../js/Logger'

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'EditableTable'});
    this.logger.log(this.props.data);
    this.logger.log(this.props.columns);
    this.createCellFunction = this.createCellFunction.bind(this);
    this.createInputCellFunction = this.createInputCellFunction.bind(this);
    this.createButtonCellFunction = this.createButtonCellFunction.bind(this);
    this.setTable = this.setTable.bind(this);
    this.state = {
      data: [],
      columns: this.props.columns
    };
    this.columns = this.props.columns;
  }

  componentWillMount() {
    this.logger.log('componentWillMount', this.props, this.state);
    this.setTable();
  }
  componentWillReceiveProps(nextProps) {
    this.logger.log('componentWillReceiveProps', this.props, nextProps);
    this.setState({data: nextProps.data});
    // this.setState({columns: nextProps.columns});
    // this.setTable();
  }

  setTable() {
    this.logger.log('setTable', this.props, this.state);
    var columns = this.state.columns;
    columns.forEach((element) => {
      if ("input" === element.cell) {
        // element["Cell"] = this.createInputCellFunction("---", "aaa");
      } else if ("button" === element.cell) {
        // element["Cell"] = this.createButtonCellFunction('remove');
      } else {
        // element["Cell"] = this.createCellFunction();
      }
    });
    // this.setState({columns: columns});
  }

  static aaa(placeholder, format) {
    return ((row) => {
    // this.logger.log(row);
      return <Input
        // transparent
        fluid
        placeholder={placeholder}
        // defaultValue={row.value}
        value={row.value || ''} // TODO 初期化でやらないとwarnでるっぽい
        onChange={((event, data) => {
          this.logger.info(row, data, data.defaultValue, "->", data.value);
          // 編集されたことを親に通知
          // this.props.onUpdateFromEditer(row.row.id, row.index, row.column.id, data.value, format);
        })}

      />

    })
  }

  createInputCellFunction(placeholder, format) {
    return ((row) => {
    // this.logger.log(row);
      return <Input
        // transparent
        fluid
        placeholder={placeholder}
        // defaultValue={row.value}
        value={row.value || ''} // TODO 初期化でやらないとwarnでるっぽい
        onChange={((event, data) => {
          this.logger.info(row, data, data.defaultValue, "->", data.value);
          // 編集されたことを親に通知
          // this.props.onUpdateFromEditer(row.row.id, row.index, row.column.id, data.value, format);
        })}

      />

    })
  }

  createButtonCellFunction(icon) {
    return ((row) => {
      return <Button
        icon={icon}
        onClick={((event, data) => {
          this.props.onUpdateFromButton(row.row.id, row.index, row.column.id);
        })}
      />
    })
  }

  createCellFunction(icon) {
    return ((row) => {
      return <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#dadada',
              borderRadius: '2px'
          }}>
            <div>{row.value}%</div>
          </div>
    })
  }

  // テーブル描画
  render() {
    this.logger.log('render', this.props, this.state);

    const _columns = [
      {
        Header: 'ID',
        accessor: 'id',
      }, {
        Header: 'Name',
        accessor: 'name',
        // Cell: this.createCellFunction("---")
      }, {
        Header: 'Start at',
        accessor: 'start_at',
        // Cell: this.createCellFunction("00:00:00", "time")
      }, {
        Header: 'Stop at',
        accessor: 'stop_at',
        // Cell: this.createCellFunction("00:00:00")
      }, {
        Header: 'Amount',
        accessor: 'amount',
        // Cell: this.createCellFunction("0.0")

      }, {
        Header: '-',
        accessor: 'remove',
        // Cell: this.createButtonCellFunction('remove')
    }]
    this.props.columns[0]["Cell"] = this.createInputCellFunction("---", "aaa");

    this.logger.info(this.props.data);
    this.logger.info(this.props.columns);
    this.logger.info(this.state.columns);
    const _cc = this.state.columns;
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
