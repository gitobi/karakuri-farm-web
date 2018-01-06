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
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  null,
  mapDispatchToProps,
)(AppStore);
