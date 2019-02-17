import React, { Component } from 'react'
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Map } from 'immutable'
import { confirmMe } from '../../actions/me'
import { Form, Button, Message } from 'semantic-ui-react';

class ConfirmForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'data': Map({
        'pincode': '',
      }),
      progress: false,
      messageLevel: null,
      message: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePincodeChange = this.handlePincodeChange.bind(this);
  }

  render() {
    return (
      <Form
        className={this.state.messageLevel}
        loading={this.state.progress}
        onSubmit={this.handleSubmit} >
        <Form.Input
          onChange={this.handlePincodeChange}
          label='確認番号'
          placeholder='123456' />
        <Message
          className={this.state.messageLevel ? this.state.messageLevel : 'hidden'}
          header='エラー'
          content={this.state.message}
        />
        <Button
          type='submit'
          content='登録を完了する'
        />
      </Form>
    );
  }

  handleSubmit(event) {
    this.setState({ progress: true});
    event.preventDefault();
    this.props.confirmMe(
      this.state.data.get('pincode'),
    ).then(
      () => {
        this.props.history.push('/');
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
          message: '確認に失敗しました。'
        });
      }
    );
  }

  handlePincodeChange(event) {
    event.preventDefault();
    this.setState({'data': this.state.data.set('pincode', event.target.value)});
  }
}

function mapStateToProps(state) {
  return (
    {}
  );
}

const mapDispatchToProps = {
  confirmMe
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmForm));
