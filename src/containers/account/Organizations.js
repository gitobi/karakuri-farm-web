import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import Logger from '../../js/Logger'

import OrganizationSummary from './OrganizationSummary';

export default class Organizations extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    // this.logger.log(this.props);

    const indexItems = [];
    for (var i in this.props.items) {
      let item = this.props.items[i];
      indexItems.push(
        <Segment key={item.id} color='blue'>
          <OrganizationSummary item={item} />
        </Segment>
        );
    }
    return (
      <div>
        {indexItems}
      </div>
    );
  }
}
