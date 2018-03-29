import React, { Component } from 'react';
import Logger from '../../js/Logger'

import Field from '../../components/part/Field';


export default class OrganizationSummary extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    // this.logger.log(this.props)
    return (
      <div>
        <div>
          <Field label='id' text={this.props.item.id} />
          <Field label='name' text={this.props.item.name} />
          <Field label='inserted_at' text={this.props.item.inserted_at} />
          <Field label='updated_at' text={this.props.item.updated_at} />
        </div>
      </div>
    );
  }
}
