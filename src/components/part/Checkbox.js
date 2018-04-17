import React, { Component } from 'react';
import { Checkbox as UICheckbox } from 'semantic-ui-react';

import Logger from '../../js/Logger'

class Checkbox extends Component {
  constructor(props) {
    super(props);
    let {
      value,
      column,
      callback,
      ...rest
    } = props;

    this.state = {
      value: value,
      column: column,
      callback: callback,
      rest: rest,
    };

    this.logger = new Logger({prefix: this.constructor.name});
    this.debug = this.debug.bind(this);
    this.onChange = this.onChange.bind(this);
    this.update = this.update.bind(this);

    // this.logger.log('construct:', this.state, props);
  }

  componentWillReceiveProps(nextProps, nextState) {
    // 親が更新した場合
    if (undefined !== nextProps.value
      && this.props.value !== nextProps.value
      && this.state.value !== nextProps.value) {
      this.setState({value: nextProps.value});
    }
  }

  debug(args) {
    this.logger.log(args,
      this.props,
      this.state,
      );
  }

  onChange(event, data) {
    // this.debug({method: 'onChange', event, data});
    let formatted = {
      value: data.checked,
    }

    this.update(formatted);
  }

  update(formatted) {

    // this.debug({method: 'update', formatted});
    if (formatted.value !== this.state.value) {
      this.setState({
        value: formatted.value,
      });
      if (this.state.callback) {
        this.state.callback(this.state.column, formatted.value);
      }
    }
  }

  render() {
    return (
      <UICheckbox
        disabled={undefined === this.state.value}
        checked={this.state.value || false}
        onChange={this.onChange}
        ref='input'
        {...this.state.rest}
      />
    );
  }
}

class CheckboxHash extends Component {
  /**
   * hashとcolumnによる描画
   * @param  {[type]} props {hash: {enable: true, ...} column='enable'}
   * @return {[type]}       [description]
   */
  constructor(props) {
    super(props);
    let {
      hash,
      column,
      ...rest
    } = props;

    this.state = {
      hash: hash,
      errors: hash._errors || {},
      column: column,
      rest: rest,
    };

    this.logger = new Logger({prefix: 'CheckboxHash'});
  }

  componentWillReceiveProps(nextProps, nextState) {
    // 親が更新した場合
    if (this.props.hash[this.state.column] !== nextProps.hash[this.state.column]) {
      this.setState({
        hash: nextProps.hash,
      });
    }
  }

  render() {
    return (
      <Checkbox
        value={this.state.hash[this.state.column]}
        column={this.state.column}
        {...this.state.rest}
      />
    );
  }
}

Checkbox.Hash = CheckboxHash;
export default Checkbox;
