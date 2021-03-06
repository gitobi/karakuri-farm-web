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

import Logger from '../js/Logger';

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.menuItem = this.menuItem.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  menuItem(name, linkTo, content, label) {
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

  handleLogoutClick(event) {
    event.preventDefault();
    this.props.logoutMe();
    this.props.history.push('/');
  }

  render() {
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
          <Menu.Menu>
            {this.menuItem('devices/waterings', '/app/devices/waterings', 'JORO')}
            {this.menuItem('devices/pyranometers', '/app/devices/pyranometers', 'JUKO')}
            {this.menuItem('devices/soilmoistures', '/app/devices/soilmoistures', 'KAERU')}
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>カラクリ設定</Menu.Header>
          <Menu.Menu>
            {this.menuItem('machines/radiational_waterings', '/app/machines/radiational_waterings', '日射比例潅水')}
          </Menu.Menu>
        </Menu.Item>

        {this.menuItem('alert', '/app/alert', 'アラート')}
        {this.menuItem('devices', '/app/devices_list', 'デバイス一覧', (this.props.devices ? this.props.devices.length : 0) )}
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

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuBar));
