import React, { Component } from 'react';
import { Dropdown as UIDropdown } from 'semantic-ui-react';

import Logger from '../../js/Logger'

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.onChange = this.onChange.bind(this);
    this.defaultDropdownOption = this.defaultDropdownOption.bind(this);
  }

  onChange(event, data) {
    // this.logger.log('onChange:', this.props.value, '->', data.value);
    if (this.props.value !== data.value
      && this.props.callback) {
      this.props.callback(data.value);
    }
  }

  defaultDropdownOption(element) {
    return {
      value: element,
      text: element,
    }
  }

  render() {
    let {
      itemToOption,
      items,
      callback,
      ...rest
    } = this.props;

    let options = [];
    if (itemToOption) {
      options = items.map(itemToOption) || [];
    } else {
      options = items.map(this.defaultDropdownOption) || [];
    }

    // this.logger.log("render:", options, '->', this.props.value);
    return (
      <UIDropdown
        selectOnNavigation={false}
        options={options}
        error={this.props.error ? true : false}
        onChange={this.onChange}
        {...rest}
      />
    );
  }
}
export default Dropdown;
