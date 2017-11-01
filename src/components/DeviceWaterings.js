import React, { Component } from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import Logger from '../js/Logger'
import DeviceWateringsTab from './DeviceWateringsTab'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/deviceWatering';

class DeviceWaterings extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DeviceWaterings'});
    this.onChangeDevice = this.onChangeDevice.bind(this);
    this.load = this.load.bind(this);
  }

  componentWillMount() {
    this.logger.info('conponentWillMount', "props", this.props);
    this.load();
  }

  load() {
    this.props.actions.loadDeviceWaterings();
  }

  onChangeDevice(id) {
    // TODO 保存がされてない場合は変更時に警告する
    this.props.actions.selectDeviceWaterings(id);
  }

  render() {
    return (
      <Grid columns={2}>
        <Grid.Column width={3}>
          <Menu
            fluid
            vertical
            secondary
            pointing
            items={this.props.deviceWaterings}
            onItemClick={(event, data) => {this.onChangeDevice(data.id);}}
            />

        </Grid.Column>
        <Grid.Column stretched width={13}>
          <DeviceWateringsTab
            deviceId = {this.props.selectedDeviceWateringsId}
            />
        </Grid.Column>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return  {
    deviceWaterings: state.deviceWatering.list,
    selectedDeviceWateringsId: state.deviceWatering.selectedId,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceWaterings);
