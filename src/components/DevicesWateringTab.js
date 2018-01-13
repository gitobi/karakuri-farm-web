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
    this.logger = new Logger({prefix: this.constructor.name});
  }

  componentWillReceiveProps(nextProps, nextState) {
    // this.logger.log("componentWillReceiveProps", this.props, '=>', nextProps);
  }

  render() {
    return (
      <DeviceSettingTab
        basePath={this.props.basePath}
        location={this.props.location}
        match={this.props.match}
        item={this.props.item}
        initialTabKey='operational_records'
        tabs={[{
          key: "setting_basic",
          title: "基本設定",
          component: DevicesSummary,
        }, {
          key: "setting_schedules",
          title: "スケジュール",
          component: DevicesWateringSchedules,
        }, {
          key: "operational_records",
          title: "灌水実績",
          component: DevicesWateringOperationalRecords,
        }, {
          key: "system_logs",
          title: "ログ",
          component: DevicesSystemLogs,
        }]}
        />
    );
  }
}
