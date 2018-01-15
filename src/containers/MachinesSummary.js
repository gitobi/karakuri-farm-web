import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import Logger from '../js/Logger'

import Field from '../components/part/Field';
import Input from '../components/part/Input';
import Dropdown from '../components/part/Dropdown';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/device';

class MachinesSummary extends Component {
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

  toDropdownOption(element) {
    return {
      value: element["id"],
      text: `${element["name"]} (${element["id"]})`,
    }
  }

  render() {
    // this.logger.log(this.props)
    return (
      <div>
        <div className='item ui header'>
          <Button as='a' onClick={this.save} loading={this.props.progress} disabled={this.props.progress || this.isDisableSaveButton()}>Save</Button>
        </div>

        <div>
          <Field label='id' text={this.props.item.id} />
          <Field label='name'>
            <Input.Hash size='large' fluid hash={this.props.item} column='name' callback={this.update} />
          </Field>
          <Field label='watering'>
            <Dropdown
              fluid
              selection
              itemToOption={this.toDropdownOption}
              items={this.props.waterings}
              value={this.props.item.watering_id}
              callback={(value) => { this.update('watering_id', value, null)}}
            />
         </Field>
          <Field label='pyranometer'>
            <Dropdown
              fluid
              selection
              itemToOption={this.toDropdownOption}
              items={this.props.pyranometers}
              value={this.props.item.pyranometer_id}
              callback={(value) => { this.update('pyranometer_id', value, null)}}
            />
          </Field>
          <Field label='heartbeated_at' text={this.props.item.heartbeated_at} />
          <Field label='inserted_at' text={this.props.item.inserted_at} />
          <Field label='updated_at' text={this.props.item.updated_at} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    waterings: state.device.getIn(['devicesList', 'watering']).toJS(),
    pyranometers: state.device.getIn(['devicesList', 'pyranometer']).toJS(),
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
)(MachinesSummary);
