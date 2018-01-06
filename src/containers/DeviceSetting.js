import React, { Component } from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import Logger from '../js/Logger';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/device';

class DevicesSetting extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DevicesPyranometers'});
    this.onChangeDevice = this.onChangeDevice.bind(this);
  }

  onChangeDevice(id) {
    // TODO 保存がされてない場合は変更時に警告する
    if (id !== this.props.deviceId) {
      // デバイスをが変更された場合
      this.props.actions.selectDevice(id, this.props.devices);
    }
  }

  render() {
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column width={3}>
            <Menu
              fluid
              vertical
              secondary
              pointing
              items={this.props.typeNames[this.props.type]}
              onItemClick={(event, data) => {this.onChangeDevice(data.id);}}
              />

          </Grid.Column>
          <Grid.Column stretched width={13}>
            {<this.props.component
              deviceId = {this.props.deviceId}
              device = {this.props.device}
            />}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log('state qqq: ', state.device.toJS());
  return  {
    typeNames: state.device.get('typeNames').toJS(),
    deviceId: state.device.get('selectedDeviceId'),
    devices: state.device.get('devices').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesSetting);
