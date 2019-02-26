// @flow
import React, { Component } from 'react';
import Logger from '../../js/Logger';

type Props = {
  onChange: Function,
  params: Object,
  paramKey: string,
  items: Array<Object>,
  itemKey: string,
  children: Object
};

type State = {
  value: ?string
};

export default class RouteCallback extends Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.state = {
      value: null
    };
    // this.logger.log('constructed:', {props: props, state: this.state});
  }

  componentDidUpdate = (prevProp: Props, prevState: State) => {
    // this.logger.log('componentDidUpdate:', {prevProp: prevProp, props: this.props, prevState: prevState, state: this.state});

    const nextValue = this.props.params[this.props.paramKey];
    // this.logger.log('componentDidUpdate:', {nextValue: nextValue});

    // if (nextValue ===
    //   JSON.stringify(prevProp.items) !== JSON.stringify(this.props.items)) {
    //   this.logger.log('componentDidUpdate:', 'changed items');

    // }

    if (nextValue !== prevState.value) {
      this.setState({value: nextValue});
      this.props.onChange(nextValue);
    }
  }

  render() {
    // this.logger.log('render', {props: this.props, state: this.state});
    return (
      {...this.props.children}
    );
  }

}
