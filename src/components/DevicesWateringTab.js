import React, { Component } from 'react';
import Logger from '../js/Logger'
import DeviceSettingTab from './DeviceSettingTab'
import DevicesSummary from '../containers/DevicesSummary'
import DevicesWateringSchedules from '../containers/DevicesWateringSchedules'
import DevicesWateringOperationalRecords from '../containers/DevicesWateringOperationalRecords'
import DevicesSystemLogs from '../containers/DevicesSystemLogs'

export default class DevicesWateringTab extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DevicesWateringTab'});
  }

  render() {
    return (
      <DeviceSettingTab
        item={this.props.item}
        activeTabKey='systemLogs'
        tabs={[{
          key: "settingBasic",
          title: "基本設定",
          component: DevicesSummary,
        }, {
          key: "settingSchedules",
          title: "スケジュール",
          component: DevicesWateringSchedules,
        }, {
          key: "operationalRecords",
          title: "灌水実績",
          component: DevicesWateringOperationalRecords,
        }, {
          key: "systemLogs",
          title: "ログ",
          component: DevicesSystemLogs,
        }]}
        />
    );
  }
}
