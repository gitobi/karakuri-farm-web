// @flow

import React, { Component } from 'react';
import Logger from '../../../js/Logger';
import Content from '../Content';
import DevicesSummary from '../../../containers/DevicesSummary'
import Schedules from './Schedules'
import OperationalRecords from './OperationalRecords'
import Stats from './Stats'
import DevicesSystemLogs from '../../../containers/DevicesSystemLogs'

import type {RouterProps} from '../../../types/BaseTypes';

type P = {
  item: Object,
};
type Props = P & RouterProps;
type State = {};

class Watering extends Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    // this.logger.log('render', {props: this.props, state: this.state});

    const tabs = [
    {
      path: "summary",
      id: "summary",
      name: "基本設定",
    }, {
      path: "schedules",
      id: "schedules",
      name: "スケジュール",
    }, {
      path: "operationalRecords",
      id: "operationalRecords",
      name: "潅水実績",
    }, {
      path: "stat",
      id: "stat",
      name: "統計",
    }, {
      path: "log",
      id: "log",
      name: "ログ",
    }];

    const componentsMap: Object = {
      summary: DevicesSummary,
      schedules: Schedules,
      operationalRecords: OperationalRecords,
      stat: Stats,
      log: DevicesSystemLogs
    };

    const linkPosition = {
      section: 'waterings',
      keys: ['device', 'device_id', 'tab_name'],
      key: 'tab_name'
    };

    return (
      <Content
        tabs={tabs}
        componentsMap={componentsMap}
        linkPosition={linkPosition}
        {...this.props}
      />
    );
  }
}

export default Watering;
