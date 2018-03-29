import React, { Component } from 'react';
import { Input as UIInput } from 'semantic-ui-react';

import Formatter from '../../js/formatter/Formatter'
import Logger from '../../js/Logger'

class Input extends Component {
  constructor(props) {
    super(props);
    let {
      value,
      column,
      placeholder,
      callback,
      formatter,
      error,
      ...rest
    } = props;

    formatter = formatter || new Formatter();

    this.state = {
      value: value,
      column: column,
      placeholder: placeholder || formatter.placeholder,
      callback: callback,
      formatter: formatter,
      error: error || null,
      rest: rest,
    };

    this.logger = new Logger({prefix: 'Input'});
    this.debug = this.debug.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
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

    if (undefined !== nextProps.error
      && this.props.error !== nextProps.error
      && this.state.error !== nextProps.error) {
      this.setState({error: nextProps.error});
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
    let formatted = this.state.formatter.onChange(this.state.value, data.value);
    this.update(formatted);
  }

  onBlur(event, data) {
    // this.debug({method: 'onBlur', event, data});
    let formatted = this.state.formatter.onBlur(this.state.value);
    this.update(formatted);
  }

  update(formatted) {
    // this.debug({method: 'update', formatted});
    if (formatted.value !== this.state.value
      || formatted.error !== this.state.error) {
      this.setState({
        value: formatted.value,
        error: formatted.error,
      });
      if (this.state.callback) {
        this.state.callback(this.state.column, formatted.value, formatted.error);
      }
    }
  }

  render() {
    return (
      <UIInput
        loading={undefined === this.state.value}
        disabled={undefined === this.state.value}
        placeholder={this.state.placeholder}
        value={this.state.value || ''}
        error={this.state.error ? true : false}
        onChange={this.onChange}
        onBlur={this.onBlur}
        ref='input'
        {...this.state.rest}
      />
    );
  }
}

class InputHash extends Component {
  /**
   * hashとcolumnによる描画
   * @param  {[type]} props {hash: {name: aaa, _errors: {name: 'error'}} column='name'}
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

    this.logger = new Logger({prefix: 'InputHash'});
  }

  componentWillReceiveProps(nextProps, nextState) {
    // 親が更新した場合
    if (this.props.hash[this.state.column] !== nextProps.hash[this.state.column]) {
      this.setState({
        hash: nextProps.hash,
      });
    }
    if ((this.props.hash._errors !== nextProps.hash._errors)
      || (this.props.hash._errors && nextProps.hash._errors
        && this.props.hash._errors[this.state.column] !== nextProps.hash._errors[this.state.column])) {
      this.setState({
        errors: nextProps.hash._errors || {},
      });
    }
  }

  render() {
    return (
      <Input
        value={this.state.hash[this.state.column]}
        error={this.state.errors[this.state.column]}
        column={this.state.column}
        {...this.state.rest}
      />
    );
  }
}

Input.Hash = InputHash;
export default Input;
