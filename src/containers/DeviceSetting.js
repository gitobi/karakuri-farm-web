// @flow

import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import Logger from '../js/Logger';
import GtbUtils from '../js/GtbUtils';
import DeviceList from './DeviceList';

type Props = {
  baseUrl: string,
  type: string,
  items: Array<Object>,
  itemMap: Object,
  component: Object,
  match: Object
};

type State = {
  activeItem: Object
};

export default class DeviceSetting extends Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.state = {
      activeItem: {id: null},
    };
    this.logger = new Logger({prefix: this.constructor.name});
  }

  change = (activeItemId: string) => {
    let item = GtbUtils.find(this.props.items, 'id', activeItemId);
    this.setState({activeItem: item});
  }

  render() {
    // this.logger.log('render', {props: this.props, state: this.state});
    let Comp = this.props.component;
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column width={3}>
            <DeviceList
              items={this.props.items}
              onClickItem={this.change}
              match={this.props.match}
              />
          </Grid.Column>
          <Grid.Column stretched width={13}>
            {<Comp
              item = {this.state.activeItem}
            />}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

