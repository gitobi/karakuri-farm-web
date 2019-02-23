// @flow

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Logger from '../../../js/Logger';

// import DeviceLayout from '../../layouts/DeviceLayout';

import DevicesSummary from '../../../containers/DevicesSummary'
import Schedules from '../../../containers/device/waterings/Schedules'
import OperationalRecords from '../../../containers/device/waterings/OperationalRecords'
import Stats from '../../../containers/device/waterings/Stats'
import DevicesSystemLogs from '../../../containers/DevicesSystemLogs'

type Props = {
  match: Object,
  history: Object
};

type State = {
};

class WateringsRouter extends Component<Props, State> {
  logger: Logger;

  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    this.logger.log('render', {props: this.props, state: this.state});
    return (
      <div>
        <Switch>

          <Route path={`${this.props.match.url}/summary`} component={DevicesSummary} />
{/*
          <Route path={`${this.props.match.url}/schedules`} component={Schedules} />
          <Route path={`${this.props.match.url}/operational_records`} component={OperationalRecords} />
          <Route path={`${this.props.match.url}/logs`} component={DevicesSystemLogs} />
*/}
          <Route path={`${this.props.match.url}/`} component={DevicesSummary} />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return (
    {
    }
  );
}

const mapDispatchToProps = {
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WateringsRouter);
