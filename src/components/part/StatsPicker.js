import React from 'react'
import {Container} from 'semantic-ui-react';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

import Logger from '../../js/Logger'
import GtbUtils from '../../js/GtbUtils'

import Field from './Field';
import Dropdown from './Dropdown';
import InlineDatePicker from './InlineDatePicker';
import InlineMonthPicker from './InlineMonthPicker';

`
unitOfPlot: グラフのプロットの単位 "minute", "hour", "day", "month"
unitOfSelect: 表示範囲の単位 "day => yyyy/mm"
dataMap: プロットするためのデータ
keys: 表示範囲の選択肢に使うデータ

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

class StatsPicker extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.selectUnitOfPlot = this.selectUnitOfPlot.bind(this);
    this.selectKey = this.selectKey.bind(this);
    this.state = {
      unitOfPlots: ["hour", "day"],
      unitOfPlot: "day",
      selectedKey: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    // this.logger.log("componentWillReceiveProps", nextProps);

    let keys = this.props.keys;
    if (!GtbUtils.compare(keys, nextProps.keys)) {
      // 変更あり
      keys = nextProps.keys;
      if (!this.state.selectedKey
        || !keys.includes(this.state.selectedKey)) {
        // 未だ未選択の場合、または、選択できない key の場合
        let tailDataMapKey = keys[keys.length - 1];
        if (tailDataMapKey) {
          this.selectKey(tailDataMapKey);
        }
      }
    }
  }

  selectUnitOfPlot(value) {
    // this.logger.log("selectUnitOfPlot", this.state.unitOfPlot, value);
    if (this.state.unitOfPlot !== value) {
      this.setState({unitOfPlot: value});
      if (this.props.onChangeUnit) {
        this.props.onChangeUnit(value);
      }
    }
  }

  selectKey(value) {
    // this.logger.log("selectKey", this.state.selectedKey, value);
    if (this.state.selectedKey !== value) {
      this.setState({selectedKey: value});
      if (this.props.onChangeKey) {
        this.props.onChangeKey(value);
      }
    }
  }

  render() {
    let {
      dataMap,
      onChangeUnit,
      onChangeKey,
      ...rest,
    } = this.props;

    return (
      <Container>

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
            <Field label='Select Date'>
              <InlineDatePicker
                selected={this.state.selectedKey}
                callback={this.selectKey}
                includeDates={this.props.keys}
              />
            </Field>
            );
          } else if ("day" === this.state.unitOfPlot) {
          return (
            <Field label='Select Month'>
              <InlineMonthPicker
                selected={this.state.selectedKey}
                callback={this.selectKey}
                includeDates={this.props.keys}
              />
            </Field>
            );
          }
        })()}

      </Container>
    );
  }
}

export default StatsPicker;
