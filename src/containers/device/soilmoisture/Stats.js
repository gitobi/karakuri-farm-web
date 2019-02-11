import React from 'react'
import {Container} from 'semantic-ui-react';

import Logger from 'src/js/Logger'

import StatsPicker from 'src/components/part/StatsPicker';
import DevicesSoilmoistureSensingRecordsGraph from 'src/components/DevicesSoilmoistureSensingRecordsGraph';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'src/actions/devicesSoilmoisture';


class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.selectUnit = this.selectUnit.bind(this);
    this.selectKey = this.selectKey.bind(this);
    this.state = {
      selectedUnit: "day",
      selectedKey: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    // this.logger.log("componentWillReceiveProps", nextProps);
    if (this.props.item.id !== nextProps.item.id) {
      // デバイス変更時
      this.load(nextProps.item.id);
    }
  }

  load(id = this.props.item.id, unit = this.state.selectedUnit) {
    if (id) {
      // this.logger.log("load", id, unit);
      this.props.actions.loadDevicesSoilmoistureStats(id, unit)
      .then((result) => {
        // 最新統計日を選択状態にする
        // this.logger.log("loaded stats", result, this.props.statsMap);
        let keys = Object.keys(this.props.statsMap).sort();
        let key = keys[keys.length - 1];
        // this.logger.log("loaded stats key", keys, key);
        this.selectKey(key);
      });
    }
  }

  selectUnit(value) {
    // this.logger.log("selectUnit", this.state.selectedUnit, "=>", value);
    this.setState({selectedUnit: value});
    this.load(this.props.item.id, value);
  }

  selectKey(value) {
    // this.logger.log("selectKey", this.state.selectedKey, "=>", value, this.props.statsMap[value]);
    this.setState({selectedKey: value});
  }

  render() {
    return (
      <Container>
        <StatsPicker
          keys={Object.keys(this.props.statsMap)}
          selectedUnit={this.state.selectedUnit}
          selectedKey={this.state.selectedKey}
          onChangeUnit={this.selectUnit}
          onChangeKey={this.selectKey}
        />

        <DevicesSoilmoistureSensingRecordsGraph
          loading={this.props.progress}
          label={`Graph ${this.state.selectedKey || ""}`}
          data={this.props.statsMap[this.state.selectedKey] || []}
          counts={true}
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return  {
    statsMap: state.devicesSoilmoisture.get('statsMap').toJS(),
    progress: state.devicesSoilmoisture.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stats);
