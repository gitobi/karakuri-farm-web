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
import BlankComponent from '@gitobi/react-blank-component';
import DevicesWaterings from './DevicesWaterings';
import DevicesPyranometers from './DevicesPyranometers';
import MachinesRadiationalWaterings from './MachinesRadiationalWaterings';
import AccountSettings from './account/AccountSettings';
// import ApiTest from './ApiTest';

class AppRoute extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'AppRoute'});
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
            <Route path={`${match.url}/devices_waterings`} component={DevicesWaterings} />
            <Route path={`${match.url}/devices_pyranometer`} component={DevicesPyranometers} />
            <Route path={`${match.url}/machine_radiational_waterings`} component={MachinesRadiationalWaterings} />
            <Route path={`${match.url}/alert`} component={BlankComponent} />
            <Route path={`${match.url}/devices`} component={BlankComponent} />
            <Route path={`${match.url}/stats`} component={BlankComponent} />
            <Route path={`${match.url}/account`} component={AccountSettings} />
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
