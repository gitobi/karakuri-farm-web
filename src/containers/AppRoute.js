import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentMe } from '../actions/me';

import Logger from '../js/Logger';

import AppLayout from '../layouts/AppLayout';
import DeviceLayout from '../layouts/DeviceLayout';

import Home from '../components/home/Home';
import Signup from '../components/home/Signup';
import Confirm from '../components/home/Confirm';
import Login from '../components/home/Login';
// import Dashboard from '../components/Dashboard';
import DevicesIndex from './device/DevicesIndex';
import BlankComponent from '@gitobi/react-blank-component';
import DevicesWaterings from './DevicesWaterings';
import DevicesPyranometers from './DevicesPyranometers';
import DevicesSoilmoisture from './device/soilmoisture/Soilmoisture';
import MachinesRadiationalWaterings from './MachinesRadiationalWaterings';
import AccountSettings from './account/AccountSettings';
import Activation from './activation/Activation';
// import ApiTest from './ApiTest';

class AppRoute extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    const PrivateRoute = ({ component: Component, ...rest }) => {
      // this.logger.log('PrivateRoute', {Component: Component, rest: rest, props: this.props, state: this.state});
      return (
        <Route {...rest} render={props => (
          this.props.isAuthenticated ? (
            <Component {...props}/>
          ) : (
            <Redirect to={{
              pathname: '/login',
              state: { from: props.location }
            }}/>
          )
        )}/>
      );
    }

    const APP_BASE = '/app';
    const AppLayoutRoute = ({match}, ...rest) => {
      // this.logger.log('AppLayoutRoute', {match: match, rest: rest, props: this.props, state: this.state});
      return (
        <AppLayout match={match} rest={rest}>
          <Switch>
            <Route exact path={`${match.url}/`} component={DevicesIndex} />
            <Route path={`${match.url}/devices`} component={DeviceLayoutRoute} />
            <Route path={`${match.url}/machines`} component={DeviceLayoutRoute} />
            <Route path={`${match.url}/alert`} component={BlankComponent} />
            <Route path={`${match.url}/devices_list`} component={DevicesIndex} />
            <Route path={`${match.url}/stats`} component={BlankComponent} />
            <Route path={`${match.url}/account`} component={AccountSettings} />
            <Route path={`${match.url}/activation`} component={Activation} />
            <Redirect to={`${match.url}`} />
          </Switch>
        </AppLayout>
      );
    }

    const DeviceLayoutRoute = ({match}, ...rest) => {
      // this.logger.log('DeviceLayoutRoute', {match: match, rest: rest, props: this.props, state: this.state});
      return (
        <DeviceLayout match={match} rest={rest}>
          <Switch>
            <Route path={`${match.url}/waterings`} component={DevicesWaterings} />
            <Route path={`${match.url}/pyranometers`} component={DevicesPyranometers} />
            <Route path={`${match.url}/soilmoistures`} component={DevicesSoilmoisture} />
            <Route path={`${match.url}/radiational_waterings`} component={MachinesRadiationalWaterings} />
            <Redirect to={APP_BASE} />
          </Switch>
        </DeviceLayout>
      );
    }

    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/signup" component={Signup} />
            <Route path="/confirm" component={Confirm} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/app" component={AppLayoutRoute} />
            <Redirect to="/" />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return (
    {
      isAuthenticated: state.me.get('isAuthenticated')
    }
  );
}

const mapDispatchToProps = {
  getCurrentMe
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppRoute);
