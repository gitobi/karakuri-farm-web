import React, { Component } from 'react';
import './Home.css';
import { Segment } from 'semantic-ui-react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Logger from '../js/Logger';
import Menubar from './MenuBar';
import BlankComponent from '@gitobi/react-blank-component';
import DevicesWaterings from './containers/DevicesWaterings';

class Home extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({ prefix: 'Home' });
    this.state = {
      activeMenubarItem: { name: 'devices' },
      visible: true,
    };
    this.handleMenubarItemClick = this.handleMenubarItemClick.bind(this);
  }

  handleMenubarItemClick(e, item) {
    this.logger.info(e, item);
    this.setState({ activeMenubarItem: item });
  }

  render() {
    return (
      <Router>
        <div>
          <Segment>
            <Menubar
              visible={this.state.visible}
              handleMenubarItemClick={this.handleMenubarItemClick}
              activeMenubarItem={this.state.activeMenubarItem}
            />
            <div className="mainContent">
              <Route path="/devices_waterings" component={DevicesWaterings} />
              <Route path="/devices_pyranometer" component={BlankComponent} />
              <Route path="/alert" component={BlankComponent} />
              <Route path="/devices" component={BlankComponent} />
              <Route path="/stats" component={BlankComponent} />
            </div>
          </Segment>
        </div>
      </Router>
    );
  }
}

export default Home;
