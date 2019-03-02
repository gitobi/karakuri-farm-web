import React, { Component } from 'react';
import Logger from '../js/Logger';

class DeviceLayout extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    // this.logger.log('render', {props: this.props, state: this.state});
    let childlen;
    if (this.props.children) {
      childlen = this.props.children;
    } else {
      childlen = <div>unknown path</div>;
    }


    return (
      <div>
        {childlen}
      </div>
    );
  }
}

export default DeviceLayout;
