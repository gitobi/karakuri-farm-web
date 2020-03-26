import React, { Component } from 'react';
import Dropdown from '../Dropdown';

import Logger from '../../../js/Logger'

class DropdownTimezone extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    let items = [
      // "Etc/UTC", とりあえず日本のみ
      "Asia/Tokyo",
    ];

    // this.logger.log("render:", options, '->', this.props.value);
    return (
      <Dropdown
        items={items}
        {...this.props}
      />
    );
  }
}
export default DropdownTimezone;
