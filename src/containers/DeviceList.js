// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Label } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';
import GtbUtils from '../js/GtbUtils';
import Logger from '../js/Logger';

class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.onClickItem = this.onClickItem.bind(this);
    this.createMenuItem = this.createMenuItem.bind(this);

    let initialActiveItemId = props.initialActiveItemId ? props.initialActiveItemId : null;
    let activeItemId = GtbUtils.findOrHead(props.items, 'id', initialActiveItemId);
    this.state = {
      activeItemId: activeItemId,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    // new Logger({prefix: "DeviceList"}).log('getDerivedStateFromProps:', prevState, '->', nextProps);
    let nextActiveItemId = GtbUtils.findOrHead(nextProps.items, 'id', prevState.activeItemId);
    if (prevState.nextActiveItemId !== nextActiveItemId) {
      return {
        activeItemId: nextActiveItemId
      };
    }
    return null;
  }

  onClickItem(event, data) {
    // TODO 保存がされてない場合は変更時に警告する
    // this.logger.log('onClickItem:', event, data, this.props.items);
    let item = GtbUtils.find(this.props.items, 'id', data.name);
    if (item.id !== this.state.activeItemId) {
      // 変更された場合
      this.setState({activeItemId: item.id});
      this.props.onClickItem(item.id)
    }
  }

  createMenuItem(item) {
    // this.logger.log('createMenuItem', item)
    let label = '';
    if (item.label) {
      label = <Label color="teal">{item.label}</Label>;
    }

    return (
      <Menu.Item
        // as={Link}
        // to={item.linkTo ? item.linkTo : item.id}
        key={item.id}
        name={item.id}
        active={this.state.activeItemId === item.id}
        onClick={this.onClickItem}
      >
        {label}
        {item.name}
      </Menu.Item>
    );
  }

  render() {
    // this.logger.log('render', this.state)
    const menuItems = this.props.items.map(this.createMenuItem);
    return (
      <Menu
        fluid
        vertical
        secondary
        pointing
      >
        {menuItems}
      </Menu>
    );
  }
}

const propTypesShapeItem = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  linkTo: PropTypes.string,
})
DeviceList.propTypes = {
  items: PropTypes.arrayOf(propTypesShapeItem).isRequired,
  initialActiveItemId: PropTypes.string,
  onClickItem: PropTypes.func,
}


export default DeviceList;
