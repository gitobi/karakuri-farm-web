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
          key: "systemLogs",
          title: "ログ",
          component: DevicesSystemLogs,
        }]}
        />
    );
  }
}
