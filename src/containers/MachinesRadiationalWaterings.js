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
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    return (
      <DeviceSetting
        type={this.state.app}
        items={this.props.machines}
        itemMap={this.props.machinesMap}
        component={MachinesRadiationalWateringTab}
        />
    );
  }
}

function mapStateToProps(state) {
  return  {
    machines: state.machine.getIn(['machinesList', app]).toJS(),
    machinesMap: state.machine.getIn(['machinesMap', app]).toJS(),
  };
}

export default connect(
  mapStateToProps,
  null,
)(MachinesRadiationalWaterings);
