// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import icon from '../images/logo.svg';
import { logoutMe } from '../actions/me';
import gitobi_logo from '../images/gitobi.png';
import '../components/Logo.css';
import '../components/App.css';
import { Image, Menu, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PartialLinkList from '../components/lib/PartialLinkList';

import Logger from '../js/Logger';

type Props = {
  match: Object,
  history: Object,
  location: Object,

  activeMenuBarItem: Object,
  handleMenuBarItemClick: Function,

  logoutMe: Function,
  me: Function,
  devices: Array<Object>,
};

type State = {
  activeItem: Object
};

class MenuBar extends Component<Props, State> {
  logger: Logger;

  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  createMenuItem = (name, linkTo, content, label) => {
  }

  menuItem = (name, linkTo, content, label) => {
    let labelContent = '';
    if (label) {
      labelContent = <Label color="teal">{label}</Label>;
    }

    return (
      <Menu.Item
        as={Link}
        to={linkTo}
        name={name}
        active={this.props.activeMenuBarItem.name === name}
        onClick={this.props.handleMenuBarItemClick}
      >
        {labelContent}
        {content}
      </Menu.Item>
    );
  }

  handleLogoutClick = (event) => {
    event.preventDefault();
    this.props.logoutMe();
    this.props.history.push('/');
  }

  render() {

    const DeviceMenuItems = [
      {id: 'device/waterings',     path: '/app/device/waterings',     name: 'JORO', position: {section: 'waterings',     keys: ['device', 'device_id', 'tab_name'], key: 'device'}},
      {id: 'device/pyranometers',  path: '/app/device/pyranometers',  name: 'JUKO', position: {section: 'pyranometers',  keys: ['device', 'device_id', 'tab_name'], key: 'device'}},
      {id: 'device/soilmoistures', path: '/app/device/soilmoistures', name: 'JUKO', position: {section: 'soilmoistures', keys: ['device', 'device_id', 'tab_name'], key: 'device'}}
    ];

    const DeviceMenuList = (
      <PartialLinkList
        nested
        match={this.props.match}
        history={this.props.history}
        location={this.props.location}
        initialReplace={true}
        items={DeviceMenuItems}
      />
    );

    return (
      <Menu
        className="menubar"
        inverted
        vertical
        fixed="left"
      >

        {/* sidebar content */}
        <Menu.Item as={Link} to='/app' header>
          <Image src={icon} verticalAlign="middle" className="App-logo" />
          <span>Karakuri Farm</span>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>デバイス設定</Menu.Header>
          {DeviceMenuList}
{/*
          <Menu.Menu>
            <div>
              {this.menuItem('device/waterings', '/app/device/waterings', 'JORO')}
              {this.menuItem('device/pyranometer', '/app/device/pyranometer', 'JUKO')}
              {this.menuItem('device/soilmoisture', '/app/device/soilmoisture', 'KAERU')}
            </div>
          </Menu.Menu>
*/}
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>カラクリ設定</Menu.Header>
          <Menu.Menu>
            {this.menuItem('machine/radiational_waterings', '/app/machine/radiational_waterings', '日射比例潅水')}
          </Menu.Menu>
        </Menu.Item>

        {this.menuItem('alert', '/app/alert', 'アラート')}
        {this.menuItem('devices', '/app/devices', 'デバイス一覧', (this.props.devices ? this.props.devices.length : 0) )}
        {this.menuItem('stats', '/app/stats', '統計')}

        <Menu.Item>
          <Menu.Header>お問合せ</Menu.Header>
          <Menu.Menu>
            {this.menuItem('account', '/app/account', this.props.me.get('username'))}
            {this.menuItem('activation', '/app/activation', 'デバイス登録')}
            <Menu.Item
              onClick={this.handleLogoutClick}
              as='a'
              content='ログアウト' />
            <Menu.Item as="a">
              <Image centered src={gitobi_logo} size="tiny" />
              <p style={{ textAlign: 'center' }}>&copy; Gitobi LLC.</p>
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return (
    {
      me:      state.me,
      devices: state.device.getIn(['devices']).toJS(),
    }
  );
}

const mapDispatchToProps = {
  logoutMe
}

// $FlowFixMe withRouterがFlowでエラーになってしまう
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuBar));
