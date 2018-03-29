import React, { Component } from 'react';
import Logger from '../../js/Logger'

import Field from '../../components/part/Field';
import Input from '../../components/part/Input';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/account';

class UserSummary extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger({prefix: this.constructor.name});
    this.update = this.update.bind(this);
  }

  update(column, value, error) {
    this.props.actions.update(
      this.props.item.id,
      column,
      value,
      error,
      );
  }

  render() {
    // this.logger.log(this.props)
    return (
      <div>
        <div>
          <Field label='id' text={this.props.item.id} />
          <Field label='name'>
            <Input.Hash size='large' fluid hash={this.props.item} column='name' callback={this.update} />
          </Field>
          <Field label='organization_id' text={this.props.item.organization_id} />
          <Field label='jwt_username' text={this.props.item.jwt_username} />
          <Field label='jwt_id' text={this.props.item.jwt_id} />
          <Field label='jwt_email' text={this.props.item.jwt_email} />
          <Field label='inserted_at' text={this.props.item.inserted_at} />
          <Field label='updated_at' text={this.props.item.updated_at} />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  null,
  mapDispatchToProps
)(UserSummary);
