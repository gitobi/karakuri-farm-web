import React, { Component } from 'react';
import { Button, Grid } from 'semantic-ui-react';
import Logger from '../js/Logger'

import Field from '../components/part/Field';
import Input from '../components/part/Input';
import Checkbox from '../components/part/Checkbox';

export default class DevicesMonitor extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger({prefix: this.constructor.name});
    this.update = this.update.bind(this);
    this.save = this.save.bind(this);
  }

  update(column, value, error) {
    // 値の更新
  }

  isDisableSaveButton() {
    // 変更されたデータがあるか判定
  }

  save(event, data) {
    // 値の保存
  }

  render() {
    // this.logger.log(this.props)
    return (
      <div>
        <div className='item ui header'>
          <Button as='a' onClick={this.save} loading={this.props.progress} disabled={this.props.progress || this.isDisableSaveButton()}>Save</Button>
        </div>

        <div>
          <Field label='monitoring_range'>
            <Grid verticalAlign={"middle"}>
              <Grid.Column width={2}>
                <Checkbox.Hash toggle size='large' hash={this.props.item} column='enable' callback={this.update} />
              </Grid.Column>
              <Grid.Column width={8}>
                <Input.Hash size='large' fluid hash={this.props.item} column='monitoring_range' callback={this.update} />
              </Grid.Column>
            </Grid>
          </Field>
          <Field label='last_result' text={this.props.item.last_result} />
        </div>
      </div>
    );
  }
}

