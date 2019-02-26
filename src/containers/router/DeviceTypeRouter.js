// @flow

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Logger from '../../js/Logger';

import DeviceIdRouter from './DeviceIdRouter';

import type {RouterProps} from '../../types/BaseTypes';

type P = {
  devicesObject: Object,
  devicesMapObject: Object,
  progress: boolean
};
type Props = P & RouterProps;

type State = {
  urlParamsTypesMap: Object
};

class DeviceTypeRouter extends React.Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
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

    return (
      <div>
        <Switch>
          <Route path={`${this.props.match.url}/:type?`} render={
            ({match, history, location}) => {
              // this.logger.log('render - set', {match: match, props: this.props, state: this.state});
              const section = match.params.type ? match.params.type : 'unknown';
              const type = this.state.urlParamsTypesMap[match.params.type];
              const devices = this.props.devicesObject[type];
              const devicesMap = this.props.devicesMapObject[type];
              // this.logger.log('render - up', {type: type, devices: devices, devicesMap: devicesMap});

              return (
                <DeviceIdRouter
                  match={match}
                  history={history}
                  location={location}

                  type={type}
                  section={section}
                  devices={devices}
                  devicesMap={devicesMap}
                  progress={this.props.progress}
                />
              )}
          }/>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    devicesObject: state.device.getIn(['devicesList']).toJS(),
    devicesMapObject: state.device.getIn(['devicesMap']).toJS(),
    progress: state.device.get('progress')
  };
}

const mapDispatchToProps = {
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceTypeRouter);
