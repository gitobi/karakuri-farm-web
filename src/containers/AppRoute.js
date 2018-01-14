import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentMe } from '../actions/me';

import Logger from '../js/Logger';

import AppLayout from '../layouts/AppLayout';

import RouteComponent from '../components/RouteComponent';
import Home from '../components/home/Home';
import Signup from '../components/home/Signup';
import Confirm from '../components/home/Confirm';
import Login from '../components/home/Login';
import Dashboard from '../components/Dashboard';
import BlankComponent from '@gitobi/react-blank-component';
import DevicesWaterings from './DevicesWaterings';
import DevicesPyranometers from './DevicesPyranometers';
import MachinesRadiationalWaterings from './MachinesRadiationalWaterings';

import DevicesSummary from './DevicesSummary';
import DevicesWateringOperationalRecords from './DevicesWateringOperationalRecords';
import DevicesSystemLogs from './DevicesSystemLogs';
import DevicesPyranometerSensingRecords from './DevicesPyranometerSensingRecords';


class AppRoute extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    const PrivateRoute = ({ component: Component, ...rest }) => {
      // this.logger.log('PrivateRoute', rest, this.props, this.state);
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

    const routes = [{
      path: '/app/devices_waterings/:id',
      component: DevicesWaterings,
      routes: [{
        path: '/app/devices_waterings/:id/setting_basic',
        component: DevicesSummary,
      },{
        path: '/app/devices_waterings/:id/operational_records',
        component: DevicesWateringOperationalRecords,
      },{
        path: '/app/devices_waterings/:id/system_logs',
        component: DevicesSystemLogs,
      },],
    },{
      path: '/app/devices_waterings',
      component: DevicesWaterings,
    },{
      path: '/app/devices_pyranometers',
      component: DevicesPyranometers,
      routes: [{
        path: '/app/devices_pyranometers/:id',
        component: DevicesPyranometers,
        routes: [{
          path: '/app/devices_pyranometers/:id/setting_basic',
          component: DevicesSummary,
        },{
          path: '/app/devices_pyranometers/:id/sensing_records',
          component: DevicesPyranometerSensingRecords,
        },{
          path: '/app/devices_pyranometers/:id/system_logs',
          component: DevicesSystemLogs,
        },],
      },],
    }]

    const AppLayoutRoute = ({match}, ...rest) => {
      // this.logger.log('AppLayoutRoute', match, rest, this.props, this.state);
      return (
        <AppLayout match={match} rest={rest}>
          <Switch>
            <Route exact path={`${match.url}/`} component={Dashboard} />
            <RouteComponent routes={routes} />
            <Route path={`${match.url}/machine_radiational_waterings`} component={MachinesRadiationalWaterings} />
            <Route path={`${match.url}/alert`} component={BlankComponent} />
            <Route path={`${match.url}/devices`} component={BlankComponent} />
            <Route path={`${match.url}/stats`} component={BlankComponent} />
            <Redirect to={`${match.url}`} />
          </Switch>
        </AppLayout>
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
