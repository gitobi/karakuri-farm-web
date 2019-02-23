import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import Logger from '../js/Logger'

import Header from '../components/part/Header'
import Field from '../components/part/Field';
import Input from '../components/part/Input';

import DevicesMonitor from './DevicesMonitor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/device';

class DevicesSummary extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger({prefix: this.constructor.name});
    this.update = this.update.bind(this);
    this.save = this.save.bind(this);
  }

  update(column, value, error) {
    this.props.actions.update(
      this.props.item.id,
      column,
      value,
      error,
      );
  }

  isDisableSaveButton() {
    // 変更されたデータがあるか判定
    return (0 === Object.keys(this.props.changed).length);
  }

  save(event, data) {
    // this.logger.log('onClick', event, data);
    this.props.actions.save(this.props.changed);
  }

  render() {
    this.logger.log('render', {props: this.props, state: this.state});

    return (
      <div>
        <div className='item ui header'>
          <Button as='a' onClick={this.save} loading={this.props.progress} disabled={this.props.progress || this.isDisableSaveButton()}>Save</Button>
        </div>

        <div>
          <Field label='id' text={this.props.item.id} />
          <Field label='device_type' text={this.props.item.device_type} />
          <Field label='name'>
            <Input.Hash size='large' fluid hash={this.props.item} column='name' callback={this.update} />
          </Field>
          <Field label='software_version' text={this.props.item.software_version} />
          <Field label='model_number' text={this.props.item.model_number} />
          <Field label='organization_id' text={this.props.item.organization_id} />
          <Field label='heartbeated_at' text={this.props.item.heartbeated_at} />
          <Field label='inserted_at' text={this.props.item.inserted_at} />
          <Field label='updated_at' text={this.props.item.updated_at} />
        </div>

        <Header label={"DeviceMonitor"}/>
        <DevicesMonitor item={this.props.item} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    changed: state.device.get('changed').toJS(),
    progress: state.device.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesSummary);
