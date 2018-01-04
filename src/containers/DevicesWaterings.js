import React, { Component } from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import Logger from '../js/Logger';
import DevicesWateringTab from '../components/DevicesWateringTab';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/device';

class DevicesWaterings extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DevicesWaterings'});
    this.onChangeDevice = this.onChangeDevice.bind(this);
  }

  onChangeDevice(id) {
    // デバイスを選択状態にする
    // TODO 保存がされてない場合は変更時に警告する
    this.props.actions.selectDevice(id, this.props.devices, this.props.deviceId);
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
              items={this.props.names}
              onItemClick={(event, data) => {this.onChangeDevice(data.id);}}
              />

          </Grid.Column>
          <Grid.Column stretched width={13}>
            <DevicesWateringTab
              deviceId = {this.props.deviceId}
              device = {this.props.device}
              />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log('state ppp: ', state.device.toJS());
  return  {
    names: state.device.getIn(['typeNames', 'watering']).toJS(),
    deviceId: state.device.get('selectedId'),
    device: state.device.get('selected').toJS(),
    devices: state.device.get('devices').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesWaterings);
