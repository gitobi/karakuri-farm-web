import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { loginMe } from '../../actions/me';
import { Form, Button, Message } from 'semantic-ui-react';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'data': Map({
        'username': '',
      }),
      progress: false,
      messageLevel: null,
      message: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  render() {
    return (
      <Form
        className={this.state.messageLevel}
        loading={this.state.progress}
        onSubmit={this.handleSubmit} >
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
          content='ログインする'
        />
      </Form>
    );
  }

  handleSubmit(event) {
    this.setState({ progress: true});
    event.preventDefault();
    let password = document.getElementById('password').value;
    this.props.loginMe(
      this.state.data.get('username'),
      password,
    ).then(
      () => {
        this.props.history.push('/app');
        this.setState({
          progress: false,
          messageLevel: null,
          message: null
        });
      },
      () => {
        console.log('fail');
        this.setState({
          progress: false,
          messageLevel: 'error',
          message: 'ログインに失敗しました。'
        });
      }
    );
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
  loginMe,
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm));
