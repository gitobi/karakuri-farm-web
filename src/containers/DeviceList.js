// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import GtbUtils from '../js/GtbUtils';
import Logger from '../js/Logger';

type Item = {
  id: string,
  name: string,
  label: ?string
};
type Props = {
  match: Object,
  items: Array<Item>,
  initialActiveItemId?: ?string,
  onClickItem: (string) => void
};
type State = {
  activeItemId: string
};

class DeviceList extends Component<Props, State> {

  logger: Logger;
  // onClickItem: Function;
  createMenuItem: Function;

  constructor(props: Props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    // this.onClickItem = this.onClickItem.bind(this);
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
    if (prevState.activeItemId !== nextActiveItemId) {
      return {
        activeItemId: nextActiveItemId
      };
    }
    return null;
  }


  onClickItem = (event: any, data: {name: string}) => {
    // TODO 保存がされてない場合は変更時に警告する
    // this.logger.log('onClickItem:', event, data, this.props.items);
    let item = GtbUtils.find(this.props.items, 'id', data.name);
    if (item.id !== this.state.activeItemId) {
      // 変更された場合
      this.setState({activeItemId: item.id});
      this.props.onClickItem(item.id)
    }
  }

  createMenuItem(item: Item) {
    // this.logger.log('createMenuItem', item)
    let label = '';
    if (item.label) {
      label = <Label color="teal">{item.label}</Label>;
    }

    let linkTo;
    if (this.props.match.params.id) {
      // 現在URLのid部分を置換
      linkTo = this.props.match.url.replace(this.props.match.params.id, item.id);
    } else {
      linkTo = this.props.match.path.replace(':id?', item.id);
    }

    return (
      <Menu.Item
        as={Link}
        to={linkTo}
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
    // this.logger.log('render', {props: this.props, state: this.state});
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
  // linkTo: PropTypes.string,
})
DeviceList.propTypes = {
  items: PropTypes.arrayOf(propTypesShapeItem).isRequired,
  // initialActiveItemId: PropTypes.string,
  onClickItem: PropTypes.func,
}


export default DeviceList;
