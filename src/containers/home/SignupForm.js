import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { signUpMe } from '../../actions/me';
import { Form, Button, Message } from 'semantic-ui-react';

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'data': Map({
        'email': '',
        'username': '',
        'password': '',
      }),
      progress: false,
      messageLevel: null,
      message: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  render() {
    return (
      <Form
        className={this.state.messageLevel}
        loading={this.state.progress}
        onSubmit={this.handleSubmit} >
        <Form.Input
          onChange={this.handleEmailChange}
          label='メールアドレス'
          placeholder='karakuri@example.com' />
        <Form.Input
          onChange={this.handleUsernameChange}
          label='ユーザ名'
          placeholder='karakuri' />
        <Form.Input
          id='password'
          label='パスワード'
          type='password' />
        <Message
          className={this.state.messageLevel ? this.state.messageLevel : 'hidden'}
          header='エラー'
          content={this.state.message}
        />
        <Button
          type='submit'
          content='登録する'
        />
      </Form>
    );
  }

  handleSubmit(event) {
    this.setState({ progress: true});
    event.preventDefault();
    let password = document.getElementById('password').value;
    this.props.signUpMe(
      this.state.data.get('username'),
      this.state.data.get('email'),
      password,
    ).then(
      () => {
        this.props.history.push('/confirm');
        this.setState({
          progress: false,
          messageLevel: null,
          message: null
        });
      },
      (error) => {
        console.log(error);
        this.setState({
          progress: false,
          messageLevel: 'error',
          message: '登録に失敗しました。'
        });
      }
    );
  }

  handleEmailChange(event) {
    event.preventDefault();
    this.setState({'data': this.state.data.set('email', event.target.value)});
  }

  handleUsernameChange(event) {
    event.preventDefault();
    this.setState({'data': this.state.data.set('username', event.target.value)});
  }
}

function mapStateToProps(state) {
  return (
    {}
  );
}

const mapDispatchToProps = {
  signUpMe
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupForm));
