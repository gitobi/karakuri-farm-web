import React, { Component } from 'react';
import logo from '../images/logo.svg';
import './Home.css';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to Karakuri Farm</h2>
        </div>
        <p className="Home-intro">
          Karakuri Farm is the best farm automation system.
        </p>
      </div>
    );
  }
}

export default Home;
