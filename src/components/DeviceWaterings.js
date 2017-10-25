import React, { Component } from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import Logger from './js/Logger'
import DeviceWateringsTab from './DeviceWateringsTab'

export default class DeviceWaterings extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DeviceWaterings'});
    this.state = {
      list: [],
      activeDeviceId: '',
    };

    this.onChangeDevice = this.onChangeDevice.bind(this);
    this.load = this.load.bind(this);
  }

  componentWillMount() {
    this.logger.info('conponentWillMount');
    this.load();
  }


  load() {
    var list = this.state.list
    if (0 === list.length) {
      list.push({
        key: "1",
        id: 1,
        name: "device 1",
      });
      list.push({
        key: "2",
        id: 2,
        name: "device 2",
      });
      this.logger.info(list);
      // this.setState({list: list});
      this.onChangeDevice(list[0]["id"]);
    }
  }

  onChangeDevice(id) {
    // TODO 保存がされてない場合は変更時に警告する

    // アクティブの変更
    const list = this.state.list;
    list.forEach((object) => {
      object["active"] = object.id === id;
    });
    this.setState({activeDeviceId: id});
    // this.setState({list: list});
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
            items={this.state.list}
            onItemClick={(event, data) => {this.onChangeDevice(data.id);}}
            />

        </Grid.Column>
        <Grid.Column stretched width={13}>
          <DeviceWateringsTab
            deviceId = {this.state.activeDeviceId}
            />
        </Grid.Column>
      </Grid>
    );
  }
}
