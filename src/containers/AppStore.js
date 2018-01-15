import React, { Component } from 'react';

import Logger from '../js/Logger';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DeviceActions from '../actions/device';
import * as MachineActions from '../actions/machine';

class AppStore extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.load = this.load.bind(this);
  }

  componentWillMount() {
    // マウント時にデバイス情報をロードする
    // this.logger.info('conponentWillMount', "props", this.props);
    this.load();
  }

  load() {
    // デバイス情報をロード
    this.props.deviceActions.loadDevices().then(
      result => {
        // 初期選択デバイスの情報読み込み
        // this.logger.log('load success:', this.props);
        // return this.props.actions.initialLoadDeviceInformations(
        //   this.props.selectedApp,
        //   this.props.typeSelectedDevice
        // )
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

    // マシーン情報をロード
    this.props.machineActions.loadMachines().then(
      result => {
        // 必要であれば、その他の初期設定
        // this.logger.log('load success:', this.props);
      },
      error => {
        this.logger.error('load error:', error);
    });
  }

  render() {
    return (
      <div className='_appStore'/>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    deviceActions: bindActionCreators(DeviceActions, dispatch),
    machineActions: bindActionCreators(MachineActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(AppStore);
