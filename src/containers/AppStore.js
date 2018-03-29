import React, { Component } from 'react';

import moment from 'moment';

import Logger from '../js/Logger';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AccountActions from '../actions/account';
import * as DeviceActions from '../actions/device';
import * as MachineActions from '../actions/machine';

class AppStore extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.load = this.load.bind(this);

    moment.locale("ja", {
      weekdays: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
      weekdaysShort: ["日", "月", "火", "水", "木", "金", "土"],
      weekdaysMin: ["日", "月", "火", "水", "木", "金", "土"],
      months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      longDateFormat : {
          LT: "h:mm A",
          LTS: "h:mm:ss A",
          L: "YYYY/MM/DD",
          LL: "YYYY MMMM Do",
          LLL: "YYYY MMMM Do LT",
          LLLL: "YYYY MMMM Do, dddd LT",
      }
    });
  }

  componentWillMount() {
    // マウント時にデバイス情報をロードする
    // this.logger.info('conponentWillMount', "props", this.props);
    this.load();
  }

  load() {
    // アカウント情報をロード
    this.props.accountActions.loadAccount().then(
      result => {
        // 必要であれば、その他の初期設定
        // this.logger.log('load success:', this.props);
      },
      error => {
        this.logger.error('load error:', error);
    });

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
    accountActions: bindActionCreators(AccountActions, dispatch),
    deviceActions: bindActionCreators(DeviceActions, dispatch),
    machineActions: bindActionCreators(MachineActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(AppStore);
