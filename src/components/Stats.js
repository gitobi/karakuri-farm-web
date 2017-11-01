import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';
import Logger from '../js/Logger'

export default class Stats extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DeviceWaterings'});
    this.state = {
      list: [],
      activeDeviceId: '',
    };

    this.debug = this.debug.bind(this);
    this.debug2 = this.debug2.bind(this);
  }

  debug() {
    this.logger.info(this.props);
    this.props.actions.increment();
    this.logger.info(this.props);
  }

  debug2() {
    this.logger.info(this.props);
    this.props.actions.p2();
    this.logger.info(this.props);
  }

  render() {
    return (
      <div className="ui container">
        <Container>
          {this.props.devices.counter}
        </Container>
        <Container>
          <Button as='a' onClick={this.debug} >+1</Button>
          <Button as='a' onClick={this.debug2} >+2</Button>
        </Container>
      </div>
    );
  }
}
