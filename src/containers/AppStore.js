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
    this.selectDevice = this.selectDevice.bind(this);
  }

  componentWillMount() {
    // マウント時にデバイス情報をロードする
    // this.logger.info('conponentWillMount', "props", this.props);
    this.load();
  }

  load() {
    // デバイス情報をロード
    this.props.actions.loadDevices().then(
      result => {
        // 初期選択デバイスの情報読み込み
        // this.logger.log('load success:', this.props);
        return this.props.actions.initialLoadDeviceInformations(
          this.props.selectedApp,
          this.props.typeSelectedDevice
        )
      },
      error => {
        this.logger.error('load error:', error);
    }).then(
      result => {
        // 初期選択デバイスの情報読み込み完了
        // this.logger.log('load info complete:', this.props);
      },
      error => {
        this.logger.error('load info error:', error);
      });
  }

  selectDevice(deviceId, force) {
    this.props.actions.selectDevice(
      deviceId,
      this.props.devices,
      force ? '' : this.props.selectedDeviceId
    ).then(
      result => {
        // this.logger.log('selectDevice success:', result);
      },
      error => {
        this.logger.error('selectDevice error:', error);
      });
  }

  render() {
    return (
      <div className='_appStore'/>
    );
  }
}

function mapStateToProps(state) {
  return  {
    typeSelectedDevice: state.device.get('typeSelectedDevice').toJS(),
    selectedDeviceId: state.device.get('selectedDeviceId'),
    devices: state.device.get('devices').toJS(),
    selectedApp: state.device.get('selectedApp'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppStore);
