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
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    return (
      <DeviceSettingTab
        basePath={this.props.basePath}
        location={this.props.location}
        match={this.props.match}
        item={this.props.item}
        initialTabKey='setting_basic'
        tabs={[{
          key: "setting_basic",
          title: "基本設定",
          component: MachinesSummary,
        }, {
          key: "setting_schedules",
          title: "スケジュール",
          component: MachinesRadiationalWateringConfigurations,
        }, {
        //   key: "operationalRecords",
        //   title: "灌水実績",
        //   component: MachinesRadiationalWateringOperationalRecords,
        // }, {
          key: "system_logs",
          title: "ログ",
          component: MachinesSystemLogs,
        }]}
        />
    );
  }
}
