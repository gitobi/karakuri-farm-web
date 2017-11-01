import React, { Component } from 'react';
import icon from '../images/logo.svg';
import gitobi_logo from '../images/gitobi.png';
import './Logo.css';
import './Home.css';
import { Image, Menu, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import Logger from '../js/Logger';

class Menubar extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({ prefix: 'MenuBar' });
    this.menuItem = this.menuItem.bind(this);
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

  render() {
    return (
      <Menu
        className="menubar"
        inverted
        vertical
        fixed="left"
      >

        {/* sidebar content */}
        <Menu.Item as="a" header>
          <Image src={icon} verticalAlign="middle" className="Home-logo" />
          <span>Karakuri Farm</span>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>デバイス設定</Menu.Header>
          <Menu.Menu>
            {this.menuItem('device_waterings', '/devices_waterings', 'Joro')}
            {this.menuItem('device_pyranometer', '/devices_pyranometer', 'Himawari')}
          </Menu.Menu>
        </Menu.Item>

        {this.menuItem('alert', '/alert', 'アラート', 1)}
        {this.menuItem('devices', '/devices', 'デバイス一覧', 6)}
        {this.menuItem('stats', '/stats', '統計', 1)}

        <Menu.Item>
          <Menu.Header>お問合せ</Menu.Header>
          <Menu.Menu>

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

export default Menubar;
