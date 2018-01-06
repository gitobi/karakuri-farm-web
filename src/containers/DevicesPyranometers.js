import React, { Component } from 'react';
import Logger from '../js/Logger';

import DeviceSetting from './DeviceSetting';
import DevicesPyranometerTab from '../components/DevicesPyranometerTab';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/device';

class DevicesPyranometers extends Component {
  constructor(props) {
    super(props);
    this.state = {app: 'pyranometer'};
    this.logger = new Logger({prefix: 'DevicesPyranometers'});
  }

  componentWillMount() {
    // this.logger.info('conponentWillMount', "props", this.props);
    this.props.actions.selectApp(this.state.app);
  }

  render() {
    return (
      <DeviceSetting
        type={this.state.app}
        component={DevicesPyranometerTab}
        />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  null,
  mapDispatchToProps,
)(DevicesPyranometers);
