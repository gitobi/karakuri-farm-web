import React, { Component } from 'react';
import { Segment, Button } from 'semantic-ui-react';
import Logger from '../../js/Logger'

import Header from '../../components/part/Header'
import Field from '../../components/part/Field';
import Input from '../../components/part/Input';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/account';

class JoinOrganization extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.state = {
      organizationName: "",
      error: false
    };

    this.update = this.update.bind(this);
    this.joinOrganization = this.joinOrganization.bind(this);
  }

  update(column, value, error) {
    this.setState({organizationName: value});
  }

  isDisableSaveButton() {
    return ("" === this.state.activationCode);
  }

  joinOrganization() {
    this.setState({error: false});
    this.props.actions.joinOrganization(this.state.organizationName)
    .then(result => {
      this.setState({error: false});
      this.props.actions.loadAccount();
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
          <Header label={"組織の作成・加入"}/>
          <Field label='組織名'>
            <Input size='large' fluid
              value={this.state.organizationName}
              error={this.state.error}
              callback={this.update}
              />
          </Field>
          <div className='item ui header'>
            <Button as='a'
              onClick={this.joinOrganization}
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
    progress: state.account.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinOrganization);
