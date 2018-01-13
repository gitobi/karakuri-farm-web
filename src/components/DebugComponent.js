import React, { Component } from 'react';
import Logger from '../js/Logger';

export default class DebugComponent extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    this.logger.log("debugRender:", this.props);
    return (
      <div>
        debugComponent!
      </div>
    );
  }
}
