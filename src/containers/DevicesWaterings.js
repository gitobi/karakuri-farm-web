import React, { Component } from 'react';
import AppLayout from '../layouts/AppLayout';
import { Grid, Menu } from 'semantic-ui-react';
import Logger from '../js/Logger';
import DevicesWateringTab from '../components/DevicesWateringTab';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesWatering';

class DevicesWaterings extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DevicesWaterings'});
    this.onChangeDevice = this.onChangeDevice.bind(this);
    this.load = this.load.bind(this);
  }

  componentWillMount() {
    // マウント時にデバイス情報をロードする
    this.logger.info('conponentWillMount', "props", this.props);
    this.load();
  }

  load() {
    // デバイス情報をロード
    this.props.actions.loadDevicesWaterings();
  }

  onChangeDevice(id) {
    // デバイスを選択状態にする
    // TODO 保存がされてない場合は変更時に警告する
    this.props.actions.selectDevicesWatering(id, this.props.selectedDevicesWateringId);
  }

  render() {
    return (
      <AppLayout>
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
              deviceId = {this.props.selectedDevicesWateringId}
              device = {this.props.selectedDevicesWatering}
              />
          </Grid.Column>
        </Grid>
      </AppLayout>
    );
  }
}

function mapStateToProps(state) {
  return  {
    names: state.devicesWatering.get('names').toJS(),
    selectedDevicesWateringId: state.devicesWatering.get('selectedId'),
    selectedDevicesWatering: state.devicesWatering.get('selected').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesWaterings);
