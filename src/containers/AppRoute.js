import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentMe } from '../actions/me';

import Logger from '../js/Logger';

import AppLayout from '../layouts/AppLayout';

import App from '../components/App';
import Home from '../components/home/Home';
import Signup from '../components/home/Signup';
import Confirm from '../components/home/Confirm';
import Login from '../components/home/Login';
import BlankComponent from '@gitobi/react-blank-component';
import DevicesWaterings from './DevicesWaterings';
import DevicesPyranometers from './DevicesPyranometers';

class AppRoute extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'AppRoute'});
  }

  componentDidMount() {
    this.props.getCurrentMe();
  }

  render() {

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={props => (
        this.props.me.get('isAuthenticated') ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/',
            state: { from: props.location }
          }}/>
        )
      )}/>
    )

    const AppLayoutRoute = ({match}, ...rest) => (
      <AppLayout match={match} rest={rest}>
          <Route path={`${match.url}/devices_waterings`} component={DevicesWaterings} />
          <Route path={`${match.url}/devices_pyranometer`} component={DevicesPyranometers} />
          <Route path={`${match.url}/alert`} component={BlankComponent} />
          <Route path={`${match.url}/devices`} component={BlankComponent} />
          <Route path={`${match.url}/stats`} component={BlankComponent} />
      </AppLayout>
    )

    return (
      <BrowserRouter>
        <div>
          <Route
            exact
            path="/"
            render={(props) => (
              <Redirect to={{
                pathname: '/app/devices',
                state: { from: props.location }
              }} />
            )} />
          <Route path="/home" component={Home} />
          <Route path="/signup" component={Signup} />
          <Route path="/confirm" component={Confirm} />
          <Route path="/login" component={Login} />
          <Route path="/app" render={(props) => (
            this.props.me.get('isAuthenticated') ? (
              <AppLayoutRoute {...props}/>
            ) : (
              <Redirect to={{
                pathname: '/home',
                state: { from: props.location }
              }}/>
              )
            )} />
        </div>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return (
    {
      me: state.me
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
