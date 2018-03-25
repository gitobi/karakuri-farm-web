import React, { Component } from 'react';
import { Segment, Button } from 'semantic-ui-react';
import Logger from '../../js/Logger'

import Header from '../../components/part/Header'
import Field from '../../components/part/Field';
import Input from '../../components/part/Input';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/device';

class Activation extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.state = {
      activationCode: "",
      error: false
    };

    this.update = this.update.bind(this);
    this.activate = this.activate.bind(this);
  }

  update(column, value, error) {
    this.setState({activationCode: value});
  }

  isDisableSaveButton() {
    return ("" === this.state.activationCode);
  }

  activate() {
    this.setState({error: false});
    this.props.actions.activate(this.state.activationCode)
    .then(result => {
      this.setState({error: false});
      this.props.actions.loadDevices();
    })
    .catch(error => {
      this.setState({error: true});
    })
  }

  render() {
    // this.logger.log(this.props)
    return (
      <div>
        <Segment loading={this.props.loading}>
          <Header label={"デバイス登録"}/>
          <Field label='アクティベーション コード'>
            <Input size='large' fluid
              value={this.state.activationCode}
              error={this.state.error}
              callback={this.update}
              />
          </Field>
          <div className='item ui header'>
            <Button as='a'
              onClick={this.activate}
              loading={this.props.progress}
              disabled={this.props.progress || this.isDisableSaveButton()}
              >
              登録
            </Button>
          </div>
        </Segment>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    progress: state.device.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activation);
