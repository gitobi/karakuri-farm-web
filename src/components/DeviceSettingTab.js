import React, { Component } from 'react';
import Logger from '../js/Logger'

export default class DeviceSettingTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: props.activeTabKey,
    };

    this.logger = new Logger({prefix: this.constructor.name});
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
        key={key}
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
        key={key}
        data-tab={key}
      >
        {content}
      </div>
    );
  }

  render() {



    const tabHeaders = this.props.tabs.map((tab) => {
        return this.createTabHeader(tab.key, tab.title);
      });

    const tabContents = this.props.tabs.map((tab) => {
      return this.createTabContent(
        tab.key,
        <tab.component
          item={this.props.item}
          {...tab.props}
          />
        );
      });

    return (
      <div>
        <div className="ui top attached tabular menu">
          {tabHeaders}
        </div>
        {tabContents}
      </div>
    );
  }
}
