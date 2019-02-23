// @flow
import React, { Component } from 'react';
import { Menu, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Logger from '../../js/Logger';
import { Map, List, fromJS } from 'immutable';

type Props = {
  // match: Object,
  // history: Object,
  // location: Object,
  onChange: Function,
  params: Object,
  paramKey: string,
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
    this.logger.log('constructed:', {props: props, state: this.state});
  }

  // static getDerivedStateFromProps(nextProps: Props, prevState: State) {
  //   new Logger({prefix: "RouteCallback"}).log('getDerivedStateFromProps:', prevState, '->', nextProps);
  //   const nextValue = nextProps.params[nextProps.paramKey];
  //   if (nextValue !== prevState.value) {
  //     return {value: nextValue};
  //   }
  //   return null;
  // }

  componentDidUpdate = (prevProp: Props, prevState: State) => {
    this.logger.log('componentDidUpdate:', {prevProp: prevProp, props: this.props, prevState: prevState, state: this.state});
    const nextValue = this.props.params[this.props.paramKey];
    if (nextValue !== prevState.value) {
      this.setState({value: nextValue});
      this.props.onChange(nextValue);
      // return {value: nextValue};
    }
    // if (prevState.value !== this.state.value) {
    //   this.props.onChange(this.state.value);
    // }
  }

  render() {
    // this.logger.log('render', {props: this.props, state: this.state});
    return (
      {...this.props.children}
    );
  }

}
