import React, { Component } from 'react';
import {
  Container,
  Segment,
} from 'semantic-ui-react';
import HomeLayout from '../../layouts/HomeLayout';
import LoginForm from '../../containers/home/LoginForm';

class Login extends Component {
  render() {
    return (
      <HomeLayout>
        <Segment
          vertical >
          <Container>
            <h1>ログイン</h1>
            <LoginForm />
          </Container>
        </Segment>
      </HomeLayout>
    );
  }
}

export default Login;
