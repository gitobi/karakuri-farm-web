import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutMe } from '../actions/me';
import {
  Button,
  Container,
  Grid,
  List,
  Menu,
  Segment,
} from 'semantic-ui-react';

import Logger from '../js/Logger';

const Footer = () => (
  <Segment
    style={{ padding: '8em 0em 1em 0em' }}
    vertical >
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <List link>
              <List.Item
                content="運営会社"
                href="http://www.gitobi.com/" />
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
    <footer>
      <p>&copy; Gitobi LLC.</p>
    </footer>
  </Segment>
);

class HomeLayout extends Component {

  constructor(props) {
    super(props);
    this.logger = new Logger({ prefix: 'HomeLayout' });
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleLogoutClick(event) {
    event.preventDefault();
    this.props.logoutMe();
  }

  render() {
    return (
      <div>
        <Segment
          inverted
          textAlign='center'
          vertical>
          <Container>
            <Menu inverted pointing secondary size='large'>
              <Menu.Item
                content="Home"
                href="/"
                active />
              {(() => {
                return (this.props.isAuthenticated) ? (
                    <Menu.Item position='right'>
                      <Button
                        content={this.props.username}
                        href="/app"
                        inverted />
                      <Button
                        content="ログアウト"
                        onClick={this.handleLogoutClick}
                        href="/"
                        inverted
                        style={{ marginLeft: '0.5em' }} />
                    </Menu.Item>
                  ) : (
                    <Menu.Item position='right'>
                      <Button
                        content="ログイン"
                        href="/login"
                        inverted />
                      <Button
                        content="会員登録"
                        href="/signup"
                        inverted
                        style={{ marginLeft: '0.5em' }} />
                    </Menu.Item>
                  );
                })()}
            </Menu>
          </Container>
        </Segment>
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return (
    {
      isAuthenticated: state.me.get('isAuthenticated'),
      username: state.me.get('username'),
    }
  );
}

const mapDispatchToProps = {
  logoutMe
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeLayout);
