import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import Logger from '../../js/Logger'

import Field from '../../components/part/Field';

export default class DevicesIndexItem extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    // this.logger.log(this.props)
    return (
      <div>
        <Grid verticalAlign={"middle"}>
          <Grid.Column width={4}>
            <Field label='name' text={this.props.item.name} />
          </Grid.Column>
          <Grid.Column width={4}>
            <Field label='heartbeated_at' text={this.props.item.heartbeated_at} />
          </Grid.Column>
          <Grid.Column width={8}>
            <Field label='id' text={this.props.item.id} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
