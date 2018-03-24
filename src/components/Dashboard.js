import React, { Component } from 'react';
import Logger from '../js/Logger';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    return (
      <div>
        dashboard!
      </div>
    );
  }
}
