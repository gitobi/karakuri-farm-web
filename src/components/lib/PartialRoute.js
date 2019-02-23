// @flow
import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

type Props = {
  match: Object,
  history: Object,
  location: Object,

  path: string,
  component: Object
};

type State = {

};

export default class PartialRoute extends Component<Props, State> {
  render() {
    return (
      <Route path={`${this.props.match.url}/${this.props.path}`} component={this.props.component} />
    );
  }
}
