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

class Menubar extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({ prefix: 'MenuBar' });
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
        active={this.props.activeMenubarItem.name === name}
        onClick={this.props.handleMenubarItemClick}
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
            {this.menuItem('device_waterings', '/app/devices_waterings', 'Joro')}
            {this.menuItem('device_pyranometer', '/app/devices_pyranometer', 'Himawari')}
          </Menu.Menu>
        </Menu.Item>

        {this.menuItem('alert', '/app/alert', 'アラート', 1)}
        {this.menuItem('devices', '/app/devices', 'デバイス一覧', 6)}
        {this.menuItem('stats', '/app/stats', '統計', 1)}

        <Menu.Item>
          <Menu.Header>お問合せ</Menu.Header>
          <Menu.Menu>
            {this.menuItem('user', '/app/user', this.props.me.get('username'))}
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
      me: state.me
    }
  );
}

const mapDispatchToProps = {
  logoutMe
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Menubar));
