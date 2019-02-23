// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import GtbUtils from '../js/GtbUtils';
import Logger from '../js/Logger';
import {createLinkTo} from '../js/ReactRouterUtils';
import PartialLinkList from '../components/lib/PartialLinkList';
import ErrorBoundary from '../components/common/ErrorBoundary';


import * as Type from '../types/BaseTypes'

type Item = {
  id: string,
  name: string,
  label: ?string
};

type Props = {
  match: Object,
  history: Object,
  location: Object,

  items: Array<Item>,
  initialActiveItemId?: ?string,
  onChangeItem: (string) => void,
};

type State = {
};

class DeviceList extends Component<Props, State> {

  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }


  onChangeItem = (id: string) => {
    // TODO 保存がされてない場合は変更時に警告する
    this.logger.log('onChangeItem:', {id: id, props: this.props, state: this.state});
    this.props.onChangeItem(id);
  }

  // tempTo = () => {
  //   return "aaa";
  // }

  // createLinkTo = (routerProps: Type.RouterProps, id: string) => {
  //   let after = '';
  //   this.props.match;
  //   if (this.props.location
  //     && this.props.location.state
  //     && this.props.location.state.after
  //     ) {
  //     after = this.props.location.state.after;
  //   }

  //   let linkTo = this.props.match.url + '/' + id + after;
  //   return {pathname: linkTo, state: {after: after}};
  // }

  // createMenuItem = (item: Item) => {
  //   // this.logger.log('createMenuItem', item)
  //   let label = '';
  //   if (item.label) {
  //     label = <Label color="teal">{item.label}</Label>;
  //   }

  //   let to = this.createLinkTo(this.props.routerProps, item.id);
  //   // let linkTo = createLinkTo(this.props.match, item.id);

  //   return (
  //     <Menu.Item
  //       as={Link}
  //       to={to}
  //       //to={{pathname: linkTo, state: {testState: true}}}
  //       //to={{pathname: this.props.match.url, query: {id: item.id}}}
  //       key={item.id}
  //       name={item.id}
  //       active={this.state.activeItemId === item.id}
  //       onClick={this.onClickItem}
  //     >
  //       {label}
  //       {item.name}
  //     </Menu.Item>
  //   );
  // }

  render() {
    this.logger.log('render', {props: this.props, state: this.state});

    // this.logger.log('replace?', this.props.match.params.id, '=>', this.state.activeItemId);

    // if (this.state.activeItemId
    //   && this.state.activeItemId !== this.props.match.params.id) {
    //   if (this.props.history) {
    //     this.logger.log('replace!', this.props.match.params.id, '=>', this.state.activeItemId);
    //     this.props.history.replace(this.createLinkTo(this.props.match, this.state.activeItemId));
    //   }
    // }


    // const menuItems = this.props.items.map(this.createMenuItem);
    // return (
    //   <Menu
    //     fluid
    //     vertical
    //     secondary
    //     pointing
    //   >
    //     {menuItems}
    //   </Menu>
    // );

    const items = this.props.items.map((item) => {
      return {
        id: item.id,
        path: item.id,
        name: item.name
      }
    });

    return (
      <ErrorBoundary>
        <PartialLinkList
          menuProps={{
            fluid: true,
            vertical: true,
            secondary: true,
            pointing: true
          }}
          position={{keys: ['device_id', 'tab_name'], key: 'device_id'}}
          match={this.props.match}
          history={this.props.history}
          location={this.props.location}
          initialActiveItemId={this.props.initialActiveItemId}
          items={items}
          onChangeItem={this.onChangeItem}
        />
      </ErrorBoundary>
    );
  }
}

export default DeviceList;
