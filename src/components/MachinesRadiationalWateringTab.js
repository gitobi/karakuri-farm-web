import React, { Component } from 'react';
import Logger from '../js/Logger'
import DeviceSettingTab from './DeviceSettingTab'
import MachinesSummary from '../containers/MachinesSummary'
import MachinesRadiationalWateringConfigurations from '../containers/MachinesRadiationalWateringConfigurations'
// import MachinesRadiationalWateringOperationalRecords from '../containers/MachinesRadiationalWateringOperationalRecords'
import MachinesSystemLogs from '../containers/MachinesSystemLogs'

export default class MachinesRadiationalWateringTab extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'MachinesRadiationalWateringTab'});
  }

  render() {
    return (
      <DeviceSettingTab
        item={this.props.item}
        activeTabKey='settingBasic'
        tabs={[{
          key: "settingBasic",
          title: "基本設定",
          component: MachinesSummary,
        }, {
          key: "settingSchedules",
          title: "スケジュール",
          component: MachinesRadiationalWateringConfigurations,
        }, {
        //   key: "operationalRecords",
        //   title: "灌水実績",
        //   component: MachinesRadiationalWateringOperationalRecords,
        // }, {
          key: "systemLogs",
          title: "ログ",
          component: MachinesSystemLogs,
        }]}
        />
    );
  }
}
