import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentMe } from '../actions/me';

import App from '../components/App';
import Home from '../components/home/Home';
import Signup from '../components/home/Signup';
import Confirm from '../components/home/Confirm';
import Login from '../components/home/Login';
import BlankComponent from '@gitobi/react-blank-component';
import DevicesWaterings from './DevicesWaterings';
import DevicesPyranometers from './DevicesPyranometers';

class AppRoute extends Component {
  componentDidMount() {
    this.props.getCurrentMe();
  }

  render() {
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
          <Route path="/alert" component={BlankComponent} />
          <Route path="/devices" component={BlankComponent} />
          <Route path="/stats" component={BlankComponent} />
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
