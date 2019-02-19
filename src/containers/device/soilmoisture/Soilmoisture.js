import React, { Component } from 'react';
import Logger from 'src/js/Logger';

import DeviceSetting from 'src/containers/DeviceSetting';
import DevicesSoilmoistureTab from 'src/components/DevicesSoilmoistureTab';

import { connect } from 'react-redux';

const app = 'soilmoisture';

class Soilmoisture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      app: app,
    };
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    return (
      <DeviceSetting
        type={this.state.app}
        items={this.props.devices}
        itemMap={this.props.devicesMap}
        component={DevicesSoilmoistureTab}
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
)(Soilmoisture);
