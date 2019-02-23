// @flow

import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import Logger from '../js/Logger';
import GtbUtils from '../js/GtbUtils';
import DeviceList from './DeviceList';
import DeviceIdRouter from './router/DeviceIdRouter';

import * as Type from '../types/BaseTypes'

type Props = {
  match: Object,
  history: Object,
  location: Object,

  component: Object,
  router: Object,

  type: string,
  items: Array<Object>,
  itemMap: Object
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

  change = (id: string) => {
    let item = GtbUtils.find(this.props.items, 'id', id);
    this.setState({activeItem: item});
  }

  render() {
    this.logger.log('render(old)', {props: this.props, state: this.state});
    let Rout = this.props.router;
    let Comp = this.props.component;
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column width={3}>
            <DeviceList
              match={this.props.match}
              history={this.props.history}
              location={this.props.location}

              items={this.props.items}
              onChangeItem={this.change}
              />
          </Grid.Column>
          <Grid.Column stretched width={13}>
            <DeviceIdRouter
              match={this.props.match}
              history={this.props.history}
              location={this.props.location}

              component={Comp}
              item = {this.state.activeItem}
            />

{/*
            {<Comp
              item = {this.state.activeItem}
              match={this.props.match}
              history={this.props.history}
            />}
*/}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

