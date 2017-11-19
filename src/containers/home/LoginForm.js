import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { loginMe } from '../../actions/me';
import {
  Form
} from 'semantic-ui-react';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'data': Map({
        'username': '',
      })
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  render() {
    return (
      <Form
        onSubmit={this.handleSubmit} >
        <Form.Input
          onChange={this.handleUsernameChange}
          label='ユーザ名'
          placeholder='karakuri' />
        <Form.Input
          id='password'
          label='パスワード'
          type='password' />
        <Form.Button
          type='submit'
          content='ログインする'
        />
      </Form>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    let password = document.getElementById('password').value;
    this.props.loginMe(
      this.state.data.get('username'),
      password,
    ).then(
      () => {
        this.props.history.push('/');
      },
      () => {
        console.log('fail');
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
