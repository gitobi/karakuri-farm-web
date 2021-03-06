import React, { Component } from 'react';
import Logger from '../js/Logger';

import DeviceSetting from './DeviceSetting';
import DevicesWateringTab from '../components/DevicesWateringTab';

import { connect } from 'react-redux';

const app = 'watering';

class DevicesWaterings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      app: app,
    };
    this.logger = new Logger({prefix: 'DevicesWaterings'});
  }

  render() {
    return (
      <DeviceSetting
        type={this.state.app}
        items={this.props.devices}
        itemMap={this.props.devicesMap}
        component={DevicesWateringTab}
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
)(DevicesWaterings);
