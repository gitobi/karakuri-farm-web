import React, { Component } from 'react';

import Logger from '../js/Logger';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/device';

class AppStore extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'AppStore'});
    this.load = this.load.bind(this);
    this.selectApp = this.selectApp.bind(this);
    this.selectDevice = this.selectDevice.bind(this);
  }

  componentWillMount() {
    // マウント時にデバイス情報をロードする
    this.logger.info('conponentWillMount', "props", this.props);
    this.load();
  }

  load() {
    // デバイス情報をロード
    this.props.actions.loadDevices();
  }

  selectApp(name) {
    console.log('aaa', name);
    // this.logger.info('ref select App:', name);
    // this.props.actions.selectApp(name);
  }

  selectDevice(deviceId) {
    this.props.actions.selectDevice(deviceId, this.props.devices, this.props.deviceId);
    // this.props.actions.selectDevice(deviceId);
  }

  render() {
    return (
      <div className='_appStore'/>
    );
  }
}

function mapStateToProps(state) {
  return  {
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(AppStore);
