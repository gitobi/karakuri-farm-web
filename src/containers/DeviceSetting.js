import React, { Component } from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import Logger from '../js/Logger';
import GtbUtils from '../js/GtbUtils';

export default class DeviceSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      names: [],
      item: {id: null},
    };
    this.logger = new Logger({prefix: 'DeviceSetting'});
    this.change = this.change.bind(this);
    this.select = this.select.bind(this);
  }

  componentWillMount() {
    this.init(this.props.items);
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.init(nextProps.items);
  }

  init(items) {
    // namesを作成して選択
    let names = this.toNames(items);
    this.select(this.state.item.id, names, items);
  }

  change(event, data, a) {
    // TODO 保存がされてない場合は変更時に警告する
    // this.logger.log('change:', event, data);
    let item = this.props.items[data.index];
    if (item.id !== this.state.item.id) {
      // 変更された場合
      this.select(item.id);
    }
  }

  toNames(items) {
    return items.map(this.toName);
  }

  toName(element) {
    return {
      key: element["id"],
      name: element["name"],
    };
  }

  select(key, names = this.state.names, items = this.props.items) {
    if (0 === names.length) {
      // namesがない場合は選択を無効にする
      this.setState({
        item: {id: null},
      });
      return;
    }

    if (null === key) {
      // 何も選択されていない場合は先頭要素を選択する
      key = names[0].key;
    }

    names = names.map(v => {
      if (v.key === key) {
        v.active = true;
      } else {
        delete v.active;
      }
      return v;
    });

    let item = GtbUtils.find(items, 'id', key) || {id: null};

    // this.logger.log('selected:', names, key, items, item);
    this.setState({
      names: names,
      item: item,
    });
  }

  render() {
    // this.logger.log('render:', this.props, this.state);
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column width={3}>
            <Menu
              fluid
              vertical
              secondary
              pointing
              items={this.state.names}
              onItemClick={this.change}
              />

          </Grid.Column>
          <Grid.Column stretched width={13}>
            {<this.props.component
              item = {this.state.item}
            />}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
