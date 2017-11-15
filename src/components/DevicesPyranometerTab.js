import React, { Component } from 'react';
import Logger from '../js/Logger'
import DevicesPyranometerSensingRecords from '../containers/DevicesPyranometerSensingRecords'

export default class DevicesPyranometerTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceId: '',
      activeTab: 'sensingRecords',
    };

    this.logger = new Logger({prefix: 'DevicesPyranometerTab'});
    this.createTabHeader = this.createTabHeader.bind(this);
    this.createTabContent = this.createTabContent.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
  }

  onTabClick(key) {
    // タブ変更
    this.setState({activeTab: key});
  }

  createTabHeader(key, content) {
    // タブヘッダの作成
    return(
      <a className={"item " + (this.state.activeTab === key ? "active" : "")}
        data-tab={key}
        onClick={() => {this.onTabClick(key)}}
      >
        {content}
      </a>
      );
  }

  createTabContent(key, content) {
    // タブコンテンツの作成
    return (
      <div className={"ui bottom attached tab segment " + (this.state.activeTab === key ? "active" : "")}
        data-tab={key}
      >
        {content}
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="ui top attached tabular menu">
          {this.createTabHeader("settingBasic", "基本設定")}
          {this.createTabHeader("sensingRecords", "計測実績")}
        </div>
        {this.createTabContent("settingBasic",
          "基本設定"
        )}
        {this.createTabContent("sensingRecords",
          <DevicesPyranometerSensingRecords
            deviceId={this.props.deviceId}
           />
        )}
      </div>
    );
  }
}