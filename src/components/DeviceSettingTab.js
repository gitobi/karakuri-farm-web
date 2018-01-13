import React, { Component } from 'react';
import Logger from '../js/Logger'
import { NavLink, Redirect } from 'react-router-dom';
import GtbUtils from '../js/GtbUtils';

export default class DeviceSettingTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: props.initialTabKey,
    };

    this.logger = new Logger({prefix: this.constructor.name});
    this.createTabHeader = this.createTabHeader.bind(this);
    this.createTabContent = this.createTabContent.bind(this);
    this.onTabClick = this.onTabClick.bind(this);

  }

  componentWillMount() {
    this.logger.log("componentWillMount", this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.logger.log("componentWillReceiveProps", this.props, '=>', nextProps);
  }

  onTabClick(key) {
    // タブ変更
    this.setState({activeTab: key});
  }

  createTabHeader(key, content) {
    // タブヘッダの作成
    const to = `${this.props.basePath}/${key}`;
    // this.logger.log("createTabHeader:", to, key, this.props);
    return(
      <NavLink className={"item"}
        to={to}
        key={key}
        data-tab={key}
        onClick={() => {this.onTabClick(key)}}
      >
        {content}
      </NavLink>
      );
    // return(
    //   <a className={"item " + (this.state.activeTab === key ? "active" : "")}
    //     key={key}
    //     data-tab={key}
    //     onClick={() => {this.onTabClick(key)}}
    //   >
    //     {content}
    //   </a>
    //   );
  }

  createTabContent(key, content) {
    // タブコンテンツの作成
    return (
      <div className={"ui bottom attached tab segment " + (this.props.match.params.tab === key ? "active" : "")}
        key={key}
        data-tab={key}
      >
        {content}
      </div>
    );
    // return (
    //   <div className={"ui bottom attached tab segment " + (this.state.activeTab === key ? "active" : "")}
    //     key={key}
    //     data-tab={key}
    //   >
    //     {content}
    //   </div>
    // );
  }

  render() {

    if ((0 !== this.props.tabs.length && this.props.match.params.id) && (
      !this.props.match.params.tab ||
      !GtbUtils.find(this.props.tabs, 'key', this.props.match.params.tab)
      )) {
      // idが指定され、かつ、タブリストが存在する状態で、
      // 以下の場合は先頭要素を選択してリダイレクトする
      // - urlにタブが指定されてない場合
      // - urlに指定されたタブが、リストに存在しない
      // urlにtabが指定されてない場合は初期タブを選択してリダイレクトする
      let pathname = `${this.props.basePath}/${this.props.match.params.id}/${this.props.initialTabKey}`;
      this.logger.log("redirect", pathname, this.props);
      // return (
      //   <div> {pathname + " - " + this.props.basePath} </div>
      // );
      return (
        <Redirect to={pathname} from={this.props.basePath} />
      );

    } else {
      return (
        <div>
          <div className="ui top attached tabular menu">
            {this.props.tabs.map((tab) => {
              return this.createTabHeader(tab.key, tab.title);
            })}
          </div>
          {this.props.tabs.map((tab) => {
            return this.createTabContent(
              tab.key,
              <tab.component
                item={this.props.item}
                />
              );
            })}
        </div>
      );
    }
  }
}
