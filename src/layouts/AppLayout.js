import React, { Component } from 'react';
import '../components/App.css';
import { Segment } from 'semantic-ui-react';
import Logger from '../js/Logger';
import Menubar from '../containers/MenuBar';

class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({ prefix: 'AppLayout' });
    this.state = {
      activeMenubarItem: { name: 'device_waterings' },
      visible: true,
    };
    this.handleMenubarItemClick = this.handleMenubarItemClick.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.logger.log('componentWillReceiveProps', 'nextProps', nextProps);
  }

  handleMenubarItemClick(e, item) {
    this.logger.info('handleMenubarItemClick', e, item);
    this.setState({ activeMenubarItem: item });
  }

  render() {
    return (
      <Segment>
        <Menubar
          visible={this.state.visible}
          handleMenubarItemClick={this.handleMenubarItemClick}
          activeMenubarItem={this.state.activeMenubarItem}
        />
        <div className="mainContent">
          {this.props.children}
        </div>
      </Segment>
    );
  }
}

export default AppLayout;
