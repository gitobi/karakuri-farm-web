import React, { Component } from 'react';
import Logger from '../js/Logger'
import DeviceSettingTab from './DeviceSettingTab'
import DevicesSummary from '../containers/DevicesSummary'
import DevicesPyranometerSensingRecords from '../containers/DevicesPyranometerSensingRecords'
import DevicesSystemLogs from '../containers/DevicesSystemLogs'

export default class DevicesPyranometerTab extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DevicesPyranometerTab'});
  }

  render() {
    return (
      <DeviceSettingTab
        item={this.props.item}
        basePath={this.props.basePath}
        location={this.props.location}
        match={this.props.match}
        item={this.props.item}
        initialTabKey='setting_basic'
        tabs={[{
          key: "setting_basic",
          title: "基本設定",
          component: DevicesSummary,
        }, {
          key: "sensing_records",
          title: "計測実績",
          component: DevicesPyranometerSensingRecords,
        }, {
          key: "system_logs",
          title: "ログ",
          component: DevicesSystemLogs,
        }]}
        />
    );
  }
}
