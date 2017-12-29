import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentMe } from '../actions/me';

import Logger from '../js/Logger';

import App from '../components/App';
import AppLayout from '../layouts/AppLayout';
import Home from '../components/home/Home';
import Signup from '../components/home/Signup';
import Confirm from '../components/home/Confirm';
import Login from '../components/home/Login';
import BlankComponent from '@gitobi/react-blank-component';
import BlankContents from '../components/BlankContents';
import DevicesWaterings from './DevicesWaterings';
import DevicesPyranometers from './DevicesPyranometers';

class AppRoute extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'AppRoute'});
    this.appLayoutRoute = this.appLayoutRoute.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentMe();
  }

  appLayoutRoute({component: Component, ...rest}) {
    this.logger.info(Component, rest);
    return(
      <Route {...rest} children={props => (
        <AppLayout>
          <Component {...props} />
        </AppLayout>
        )} />
      );
  }

  render() {
    const AppLayoutRouteRender = ({component: Component, ...rest}) => (
      <Route {...rest} render={props => (
        <AppLayout>
          <Component {...props} />
        </AppLayout>
        )} />
      );

    const AppLayoutRouteChildren = ({path: path, component: Component, ...rest}) => (
      <Route path={path} children={({match}) => (
        <AppLayout>
          <Component />
        </AppLayout>
        )} />
      );

    return (
      <BrowserRouter>
        <div>
          <Route
            exact
            path="/"
            render={() =>(
              this.props.me.get('isAuthenticated') ? (<Route component={App} />) : (<Route component={Home} />)
            )} />
          <Route path="/signup" component={Signup} />
          <Route path="/confirm" component={Confirm} />
          <Route path="/login" component={Login} />
          <Route path="/devices_waterings" component={DevicesWaterings} />
          <Route path="/devices_pyranometer" component={DevicesPyranometers} />
          <Route path="/alert" component={BlankContents} />
          <Route path="/devices" component={BlankComponent} />
          <Route path="/stats" component={BlankComponent} />

          <Route children={({match, ...rest}) => (
            <AppLayout>
              {match && <BlankComponent {...rest} />}
            </AppLayout>
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
