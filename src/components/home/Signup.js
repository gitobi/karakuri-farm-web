import React, { Component } from 'react';
import {
  Container,
  Segment,
} from 'semantic-ui-react';
import HomeLayout from '../../layouts/HomeLayout';
import SignupForm from '../../containers/home/SignupForm';

class Signup extends Component {
  render() {
    return (
      <HomeLayout>
        <Segment
          vertical >
          <Container>
            <h1>会員登録</h1>
            <SignupForm />
          </Container>
        </Segment>
      </HomeLayout>
    );
  }
}

export default Signup;
