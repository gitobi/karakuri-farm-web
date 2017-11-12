import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import App from '../components/App';
import Home from '../components/home/Home';
import Signup from '../components/home/Signup';
import Login from '../components/home/Login';
import BlankComponent from '@gitobi/react-blank-component';
import DevicesWaterings from './DevicesWaterings';

const isLoggedIn = false;

class AppRoute extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route
            exact
            path="/"
            render={() =>(
              isLoggedIn ? (<Route component={App} />) : (<Route component={Home} />)
            )} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/devices_waterings" component={DevicesWaterings} />
          <Route path="/devices_pyranometer" component={BlankComponent} />
          <Route path="/alert" component={BlankComponent} />
          <Route path="/devices" component={BlankComponent} />
          <Route path="/stats" component={BlankComponent} />
        </div>
      </BrowserRouter>
    );
  }
}

export default AppRoute;
