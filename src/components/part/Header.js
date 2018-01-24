import React from 'react'
import {Header as UIHeader} from 'semantic-ui-react';

import Logger from '../../js/Logger'

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    return (
      <UIHeader disabled>
        {this.props.label}
      </UIHeader>
    );
  }
}

export default Header;
