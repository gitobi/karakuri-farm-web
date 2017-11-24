import React, { Component } from 'react'
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Map } from 'immutable'
import { confirmMe } from '../../actions/me'
import {
  Form
} from 'semantic-ui-react';

class ConfirmForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'data': Map({
        'pincode': '',
      })
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePincodeChange = this.handlePincodeChange.bind(this);
  }

  render() {
    return (
      <Form
        onSubmit={this.handleSubmit} >
        <Form.Input
          onChange={this.handlePincodeChange}
          label='確認番号'
          placeholder='123456' />
        <Form.Button
          type='submit'
          content='登録を完了する'
        />
      </Form>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.confirmMe(
      this.state.data.get('pincode'),
    ).then(
      () => {
        this.props.history.push('/');
      },
      () => {
        console.log('fail');
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
