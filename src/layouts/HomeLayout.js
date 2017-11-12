import React, { Component } from 'react';
import {
  Button,
  Container,
  Grid,
  List,
  Menu,
  Segment,
} from 'semantic-ui-react';

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
            </Menu>
          </Container>
        </Segment>
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

export default HomeLayout;
