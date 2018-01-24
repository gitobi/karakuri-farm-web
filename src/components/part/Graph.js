import React from 'react'
import {Container} from 'semantic-ui-react';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

import Logger from '../../js/Logger'

import Field from './Field';
import Dropdown from './Dropdown';
import InlineDatePicker from './InlineDatePicker';
import InlineMonthPicker from './InlineMonthPicker';

`
unitOfPlot: グラフのプロットの単位 "minute", "hour", "day", "month"
unitOfSelect: 表示範囲の単位 "day => yyyy/mm"
dataMap: プロットするためのデータ
dataMapKeys: 表示範囲の選択肢に使うデータ

unitOfPlot === "month" の場合
dataMap["2017"] = [
  {_plot_x: "04", value1: 1, value2: 0.1}, // (2017年04月の集計)
  {_plot_x: "05", value1: 1, value2: 0.1}, // (2017年05月の集計)
  ・・・
]

unitOfPlot === "day" の場合
dataMap["2017-04"] = [
  {_plot_x: "01", value1: 1, value2: 0.1}, // (2017年04月01日の集計)
  {_plot_x: "02", value1: 1, value2: 0.1}, // (2017年04月02日の集計)
  ・・・
]

unitOfPlot === "hour" の場合
dataMap["2017-04-01"] = [
  {_plot_x: "01", value1: 1, value2: 0.1}, // (2017年04月01日 01時の集計)
  {_plot_x: "02", value1: 1, value2: 0.1}, // (2017年04月01日 02時の集計)
  ・・・
]

unitOfPlot === "minute" の場合
dataMap["2017-04-01"] = [
  {_plot_x: "01:00", value1: 1, value2: 0.1}, // (2017年04月01日 01時00分の集計)
  {_plot_x: "01:01", value1: 1, value2: 0.1}, // (2017年04月01日 01時01分の集計)
  ・・・
]
`

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.selectUnitOfPlot = this.selectUnitOfPlot.bind(this);
    this.selectDataMapKey = this.selectDataMapKey.bind(this);
    this.state = {
      unitOfPlots: ["minute", "hour", "day"],
      unitOfPlot: "day",
      dataMapKeys: [],
      selectedDateMapKey: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    // this.logger.log("componentWillReceiveProps", nextProps);

    let dataMapKeys = this.state.dataMapKeys;
    if (this.props.dataMap !== nextProps.dataMap) {
      // データに変更があった場合
      dataMapKeys = Object.keys(nextProps.dataMap);
      this.setState({
        dataMapKeys: dataMapKeys,
      });
    }

    if (!this.state.selectedDateMapKey
      || !dataMapKeys.includes(this.state.selectedDateMapKey)) {
      // 未だ未選択の場合、または、選択できないmapKeyの場合
      let tailDataMapKey = dataMapKeys[dataMapKeys.length - 1];
      if (tailDataMapKey) {
        this.setState({
          selectedDateMapKey: tailDataMapKey,
        })
      }
    }
  }

  selectUnitOfPlot(value) {
    // this.logger.log("selectUnitOfPlot", this.state.unitOfPlot, value);
    if (this.state.unitOfPlot !== value) {
      this.setState({unitOfPlot: value});
      if (this.props.onChangeUnitOfPlot) {
        this.props.onChangeUnitOfPlot(value);
      }
    }
  }

  selectDataMapKey(value) {
    // this.logger.log("selectDataMapKey", this.state.selectedDateMapKey, value);
    if (this.state.selectedDateMapKey !== value) {
      this.setState({selectedDateMapKey: value});
      if (this.props.onChangeDataMapKey) {
        this.props.onChangeDataMapKey(value);
      }
    }
  }

  render() {
    let {
      dataMap,
      onChangeUnitOfPlot,
      onChangeDataMapKey,
      ...rest,
    } = this.props;

    return (
      <Container>
{/*        <Field label='date'>
          <Dropdown
            selection
            itemToOption={this.toDropdownOption}
            items={Object.keys(this.props.recordsParDay)}
            value={this.state.selectedDay}
            callback={(value) => { this.select(value)}}
          />
        </Field>
*/}

        <Field label='Unit of Plot'>
          <Dropdown
            selection
            items={this.state.unitOfPlots}
            value={this.state.unitOfPlot}
            callback={(value) => {this.selectUnitOfPlot(value)}}
          />
        </Field>

        {(() => {
          if ("hour" === this.state.unitOfPlot
            || "minute" === this.state.unitOfPlot) {

          return (
            <Field>
              <InlineDatePicker
                selected={this.state.selectedDateMapKey}
                callback={this.selectDataMapKey}
                includeDates={this.state.dataMapKeys}
              />
            </Field>
            );
          } else if ("day" === this.state.unitOfPlot) {
          return (
            <Field>
              <InlineMonthPicker
                selected={this.state.selectedDateMapKey}
                callback={this.selectDataMapKey}
                includeDates={this.state.dataMapKeys}
              />
            </Field>
            );
          }
        })()}

        <div className="ui disabled header">
          {`Graph ${this.state.selectedDateMapKey}`}
        </div>

        <LineChart
          data={dataMap[this.state.selectedDateMapKey]
            ? dataMap[this.state.selectedDateMapKey]
            : []
          }

          {...rest}
          >
          {this.props.children}
        </LineChart>
      </Container>
    );
  }
}

export default Graph;
