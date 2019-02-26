// @flow

import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import Logger from '../../js/Logger';
import GtbUtils from '../../js/GtbUtils';

type Props = {
  left: Object,
  right: Object
};
type State = {};

export default class Layout extends Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    // this.logger.log('render', {props: this.props, state: this.state});
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column width={3}>
            {this.props.left}
          </Grid.Column>
          <Grid.Column stretched width={13}>
            {this.props.right}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

