import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import Logger from '../js/Logger';
import GtbUtils from '../js/GtbUtils';
import DeviceList from './DeviceList';

export default class DeviceSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: {id: null},
    };
    this.logger = new Logger({prefix: this.constructor.name});
    this.change = this.change.bind(this);
  }

  change(activeItemId) {
    let item = GtbUtils.find(this.props.items, 'id', activeItemId);
    this.setState({activeItem: item});
  }

  render() {
    // this.logger.log('render:', this.props, this.state);
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column width={3}>
            <DeviceList
              items={this.props.items}
              onClickItem={this.change}
              />
          </Grid.Column>
          <Grid.Column stretched width={13}>
            {<this.props.component
              item = {this.state.activeItem}
            />}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
