import React, { Component } from 'react';
import Logger from '../js/Logger';

import DeviceSetting from './DeviceSetting';
import DevicesPyranometerTab from '../components/DevicesPyranometerTab';

import { connect } from 'react-redux';

const app = 'pyranometer';

class DevicesPyranometers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      app: app,
    };
    this.logger = new Logger({prefix: 'DevicesPyranometers'});
  }

  render() {
    return (
      <DeviceSetting
        type={this.state.app}
        items={this.props.devices}
        itemMap={this.props.devicesMap}
        component={DevicesPyranometerTab}
        match={this.props.match}
        />
    );
  }
}

function mapStateToProps(state) {
  return  {
    devices: state.device.getIn(['devicesList', app]).toJS(),
    devicesMap: state.device.getIn(['devicesMap', app]).toJS(),
  };
}

export default connect(
  mapStateToProps,
  null,
)(DevicesPyranometers);
