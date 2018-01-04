import React, { Component } from 'react';
import Logger from '../js/Logger';

import DeviceSetting from './DeviceSetting';
import DevicesWateringTab from '../components/DevicesWateringTab';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/device';


class DevicesWaterings extends Component {
  constructor(props) {
    super(props);
    this.state = {app: 'watering'};
    this.logger = new Logger({prefix: 'DevicesWaterings'});
  }

  componentWillMount() {
    // this.logger.info('conponentWillMount', "props", this.props);
    this.props.actions.selectApp(this.state.app);
  }

  render() {
    return (
      <DeviceSetting
        type={this.state.app}
        component={DevicesWateringTab}
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
)(DevicesWaterings);
