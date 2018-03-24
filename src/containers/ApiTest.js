import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import Logger from '../js/Logger';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/me';

import Bastet from '../js/Bastet'
import request from 'superagent'
import { userPool } from '../js/AuthUserPool';

class ApiTest extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.debugGet = this.debugGet.bind(this);
  }

  debugGet(host, error) {
    let url = host + '/devices/waterings/';

    return new Promise((resolve, reject) => {
      // ログイン情報取得
      userPool.getCurrentUser().getSession((err, signInUserSession) => {
        this.logger.log('getSession', err, signInUserSession);
        resolve(signInUserSession);
      });
    }).then((result) => {

      let idToken = result.idToken.jwtToken;
      if (error) {
        idToken   = idToken + "a";
      }

      let query = {date_trunc: "day"};
      let bastet = new Bastet();
      let hash = bastet.nestedObjectToQueryObject(query);
      console.log(hash);

      request
        .get(url)
        .set('Content-Type', 'application/json')
        .set('Authorization', idToken)
        .query(hash)
        .then((data) => {
          console.log(data);
          Promise.resolve(data);
        }).catch((err) => {
          console.log(err);
          Promise.reject(err);
        });
      });
  }


  render() {
    // console.log('ppp', process.env);
    console.log(userPool.getCurrentUser());
    console.log(userPool);
    return (
      <div>
        dashboard!
        <div>
          {this.props.username}
        </div>

        <div>
          <p>http://localhost:4000</p>
          <Button as='a' onClick={() => this.debugGet("http://localhost:4000", false)} >DebugGet Success</Button>
          <Button as='a' onClick={() => this.debugGet("http://localhost:4000", true)} >DebugGet Error</Button>
        </div>

        <div>
          <p>http://api.localhost:4000</p>
          <Button as='a' onClick={() => this.debugGet("http://api.localhost:4000", false)} >DebugGet Success</Button>
          <Button as='a' onClick={() => this.debugGet("http://api.localhost:4000", true)} >DebugGet Error</Button>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    username: state.me.get('username'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApiTest);
