import React, { Component } from 'react';
import Logger from '../js/Logger';

import DeviceSetting from './DeviceSetting';
import MachinesRadiationalWateringTab from '../components/MachinesRadiationalWateringTab';

import { connect } from 'react-redux';

const app = 'radiationalWatering';

class MachinesRadiationalWaterings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      app: app,
    };
    this.logger = new Logger({prefix: 'MachinesRadiationalWaterings'});
  }

  render() {
    return (
      <DeviceSetting
        type={this.state.app}
        items={this.props.devices}
        itemMap={this.props.devicesMap}
        component={MachinesRadiationalWateringTab}
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
)(MachinesRadiationalWaterings);
