import React, { Component } from 'react';
import Logger from '../js/Logger'

import Field from '../components/part/Field';
import Input from '../components/part/Input';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/device';

class DevicesSummary extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger({prefix: 'DevicesSummary'});
    // this.createFeed = this.createFeed.bind(this);
    this.update = this.update.bind(this);
  }

  update(column, value, error) {
    this.props.actions.update(
      this.props.device.id,
      column,
      value,
      error,
      );
  }

  render() {
    // TODO nameを変更できるようにする
    // this.logger.log(this.props)
    return (
      <div>
        <div>
          <Field label='id' text={this.props.device.id} />
          <Field label='device_type' text={this.props.device.device_type} />
          <Field label='name'>
            <Input.Hash size='large' fluid hash={this.props.device} column='name' callback={this.update}/>
          </Field>
          <Field label='software_version' text={this.props.device.software_version} />
          <Field label='model_number' text={this.props.device.model_number} />
          <Field label='heartbeated_at' text={this.props.device.heartbeated_at} />
          <Field label='inserted_at' text={this.props.device.inserted_at} />
          <Field label='updated_at' text={this.props.device.updated_at} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    device: state.device.get('selectedDevice').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesSummary);
