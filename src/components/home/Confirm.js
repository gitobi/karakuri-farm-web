import React, { Component } from 'react';
import {
  Container,
  Segment,
} from 'semantic-ui-react';
import HomeLayout from '../../layouts/HomeLayout';
import ConfirmForm from '../../containers/home/ConfirmForm';

class Confirm extends Component {
  render() {
    return (
      <HomeLayout>
        <Segment
          vertical >
          <Container>
            <h1>登録の確認</h1>
            <p>ご登録のメールアドレスに確認番号を送信しました。</p>
            <p>確認番号を入力して、会員登録を完了してください。</p>
            <ConfirmForm />
          </Container>
        </Segment>
      </HomeLayout>
    );
  }
}

export default Confirm;
