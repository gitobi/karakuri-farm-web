import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import Logger from '../js/Logger';

export default class RouteComponent extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    let {
      basePath,
      routes,
      ...rest
    } = this.props;

    const RouteWithSubRoutes = (route) => (
      <Route path={route.path} render={props => (
        <route.component {...props} routes={route.routes}/>
      )}/>
    )

    this.logger.log("render:", this.props, routes, rest);
    return (
      <div>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route}/>
        ))}
      </div>
    );
  }
}
