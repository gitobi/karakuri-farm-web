import React, { Component } from 'react';
import Logger from '../js/Logger'
import DeviceSettingTab from './DeviceSettingTab'
import DevicesSummary from '../containers/DevicesSummary'
import DevicesPyranometerSensingRecords from '../containers/DevicesPyranometerSensingRecords'
import DevicesPyranometerStats from '../containers/DevicesPyranometerStats'
import DevicesSystemLogs from '../containers/DevicesSystemLogs'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesPyranometer';

class DevicesPyranometerTab extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.state = {
      statsUnit: "day",
    };
  }

  componentDidMount() {
    // 初期表示時
    this.load();
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (this.props.item.id !== nextProps.item.id) {
      // デバイス変更時
      this.load(nextProps.item.id);
    }
  }

  load(id = this.props.item.id) {
    if (id) {
      this.props.actions.loadDevicesPyranometerWorkingDays(id);
      this.props.actions.loadDevicesPyranometerStats(id, this.state.statsUnit);
    }
  }

  render() {
    return (
      <DeviceSettingTab
        item={this.props.item}
        workingDays={this.props.workingDays}
        activeTabKey='sensingRecords'
        tabs={[{
          key: "settingBasic",
          title: "基本設定",
          component: DevicesSummary,
        }, {
          key: "sensingRecords",
          title: "計測実績",
          component: DevicesPyranometerSensingRecords,
        }, {
          key: "stats",
          title: "統計",
          component: DevicesPyranometerStats,
        }, {
          key: "systemLogs",
          title: "ログ",
          component: DevicesSystemLogs,
        }]}
        />
    );
  }
}


function mapStateToProps(state) {
  return  {
    workingDays: state.devicesPyranometer.getIn(['workingDays']).toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DevicesPyranometerTab);
