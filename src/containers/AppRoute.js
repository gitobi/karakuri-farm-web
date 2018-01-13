import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentMe } from '../actions/me';

import Logger from '../js/Logger';

import AppLayout from '../layouts/AppLayout';

import Home from '../components/home/Home';
import Signup from '../components/home/Signup';
import Confirm from '../components/home/Confirm';
import Login from '../components/home/Login';
import Dashboard from '../components/Dashboard';
import DebugComponent from '../components/DebugComponent';
import BlankComponent from '@gitobi/react-blank-component';
import DevicesWaterings from './DevicesWaterings';
import DevicesPyranometers from './DevicesPyranometers';
import MachinesRadiationalWaterings from './MachinesRadiationalWaterings';

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

    const AppLayoutRoute = ({match}, ...rest) => {
      // this.logger.log('AppLayoutRoute', match, rest, this.props, this.state);
      return (
        <AppLayout match={match} rest={rest}>
          <Switch>
            <Route exact path={`${match.url}/`} component={Dashboard} />
            <RouteWrapper path={`${match.url}/devices_waterings/:id?/:tab?`} component={DevicesWaterings} componentProps={{basePath: `${match.url}/devices_waterings`,}} />
            <RouteWrapper path={`${match.url}/devices_pyranometer/:id?/:tab?`} component={DevicesPyranometers} componentProps={{basePath: `${match.url}/devices_pyranometer`,}} />
            <RouteWrapper path={`${match.url}/machine_radiational_waterings/:id?/:tab?`} component={MachinesRadiationalWaterings} componentProps={{basePath: `${match.url}/machine_radiational_waterings`,}} />
            <RouteWrapper path={`${match.url}/alert`}
              component={DebugComponent}
              componentProps={{
                basePath: `${match.url}/alert`,
                tempa: "a",
              }}
            />
            <Route path={`${match.url}/devices`} component={DebugComponent} />
            <Route path={`${match.url}/stats`} component={BlankComponent} />
            <Redirect to={`${match.url}`} />
          </Switch>
        </AppLayout>
      );
    }

    const RouteWrapper = ({
      path: path,
      exact: exact,
      component: Component,
      componentProps: componentProps,
    }, ...rest) => {
      return (
        <Route exact={exact} path={path} render={(props) => {
          return (
            <Component {...componentProps} {...props} />
          );
          // return (
          //   <div>
          //     basePath componentProps a
          //   </div>
          //   );
        }} />
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
