import React, { Component } from 'react';
import AppLayout from '../layouts/AppLayout';
import BlankComponent from '@gitobi/react-blank-component';
import Logger from '../js/Logger';

export default class BlankContents extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'BlankContents'});
  }

  render() {
    return (
      <AppLayout>
        <BlankComponent />
      </AppLayout>
    );
  }
}
