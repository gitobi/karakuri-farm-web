// @flow
//
import React, { Component } from 'react';
import Logger from '../js/Logger';


type Props = {
  children: Object,
};

type State = {
};


class DeviceLayout extends Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.logger = new Logger({ prefix: this.constructor.name });
  }

  render() {
    // this.logger.log('render', { props: this.props, state: this.state });

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
