// @flow

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Logger from '../../js/Logger';

import DeviceLayout from '../../layouts/DeviceLayout';
import DeviceIdRouter from './DeviceIdRouter';
import * as Type from '../../types/BaseTypes'

type Props = {
  match: Object,
  history: Object,
  location: Object,

  devicesObject: Object,
  devicesMapObject: Object,
  progress: boolean,

};

type State = {
  urlParamsTypesMap: Object
};

class DeviceTypeRouter extends Component<Props, State> {
  logger: Logger;

  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.state = {
      urlParamsTypesMap: {
        waterings: 'watering',
        pyranometers: 'pyranometer',
        soilmoistures: 'soilmoisture',
        radiational_waterings: 'radiational_watering',
      }
    };

  }

  render() {
    this.logger.log('render', {props: this.props, state: this.state});
    // let Comp = this.props.component;

    return (
      <div>
        <Switch>
          <Route path={`${this.props.match.url}/:type?`} render={
            ({match, history, location}) => {
              this.logger.log('render - set', {match: match, props: this.props, state: this.state});
              const type = this.state.urlParamsTypesMap[match.params.type];
              const devices = this.props.devicesObject[type];
              const devicesMap = this.props.devicesMapObject[type];
              this.logger.log('render - up', {type: type, devices: devices, devicesMap: devicesMap});

              return (
                <DeviceIdRouter
                  type={type}
                  devices={devices}
                  devicesMap={devicesMap}
                  progress={this.props.progress}
                  match={match}
                  history={history}
                  location={location}
                  />
              )}
          }/>
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    devicesObject: state.device.getIn(['devicesList']).toJS(),
    devicesMapObject: state.device.getIn(['devicesMap']).toJS(),
    progress: state.device.progress
  };
}

const mapDispatchToProps = {
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceTypeRouter);
