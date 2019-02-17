import React, { Component } from 'react';
import '../components/App.css';
import { Segment } from 'semantic-ui-react';
import Logger from '../js/Logger';
import MenuBar from '../containers/MenuBar';
import AppStore from '../containers/AppStore';

class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.state = {
      activeMenuBarItem: { name: 'dashboard' },
      visible: true,
    };
    this.handleMenuBarItemClick = this.handleMenuBarItemClick.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    // this.logger.log('componentWillReceiveProps', 'nextProps', nextProps);
  }

  handleMenuBarItemClick(e, item) {
    // this.logger.info('handleMenuBarItemClick', e, item);
    this.setState({ activeMenuBarItem: item });
  }

  render() {
    return (
      <Segment>
        <AppStore ref="app_store" />
        <MenuBar
          visible={this.state.visible}
          handleMenuBarItemClick={this.handleMenuBarItemClick}
          activeMenuBarItem={this.state.activeMenuBarItem}
        />
        <div className="mainContent">
          {this.props.children}
        </div>
      </Segment>
    );
  }
}

export default AppLayout;
