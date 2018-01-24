import React from 'react'
import {Container, Segment} from 'semantic-ui-react';

import Logger from '../js/Logger'

import StatsPicker from '../components/part/StatsPicker';
import DevicesPyranometerSensingRecordsGraph from '../components/DevicesPyranometerSensingRecordsGraph';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesPyranometer';

`
初期表示
 {item: a, statsMap: {2017/12: {value: 1}}, selected: 2017/12}
アイテム変更
 {item: b, statsMap: {2017/12: {value: 1}}, selected: 2017/12}
ユニット変更
 {item: b, statsMap: {2017/12: {value: 1}}, selected: 2017/12}

key変更
 {item: b, statsMap: {2017/12: {value: 1}}, selected: 2017/12}

`


class DevicesPyranometerStats extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.selectUnit = this.selectUnit.bind(this);
    this.selectKey = this.selectKey.bind(this);
    this.state = {
      unit: "day",
      selectedKey: null,
    };
  }

  componentDidMount() {
    // 初期表示時
    this.load();
  }

  componentWillReceiveProps(nextProps) {
    // this.logger.log("componentWillReceiveProps", nextProps);
    if (this.props.item.id !== nextProps.item.id) {
      // デバイス変更時
      this.load(nextProps.item.id);
    }
  }

  load(id = this.props.item.id, unit = this.state.unit) {
    if (id) {
      this.props.actions.loadDevicesPyranometerStats(id, unit);
    }
  }

  selectUnit(value) {
    this.logger.log("selectUnit", this.state.unit, "=>", value);
    this.setState({unit: value});
    this.load(this.props.item.id, value);
  }

  selectKey(value) {
    this.logger.log("selectKey", this.state.selectedKey, "=>", value);
    this.setState({
      selectedKey: value,
    });
  }

  render() {
    return (
      <Container>
        <StatsPicker
          keys={Object.keys(this.props.statsParGroupUnit)}
          onChangeUnit={this.selectUnit}
          onChangeKey={this.selectKey}
        />

        <DevicesPyranometerSensingRecordsGraph
          loading={this.props.progress}
          label={`Graph ${this.state.selectedKey || ""}`}
          data={this.props.statsParGroupUnit[this.state.selectedKey]
            ? this.props.statsParGroupUnit[this.state.selectedKey]
            : []
          }
          />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return  {
    statsParGroupUnit: state.devicesPyranometer.get('statsParGroupUnit').toJS(),
    progress: state.devicesPyranometer.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesPyranometerStats);
