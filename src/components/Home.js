import React, { Component } from 'react';
import logo from '../images/logo.svg';
import './Home.css';
import { Container } from 'semantic-ui-react'

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <Container className="Home-header" style={{height: '240px' }}>
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to Karakuri Farm</h2>
        </Container>
        <p className="Home-intro">
          Karakuri Farm is the best farm automation system.
        </p>
      </div>
    );
  }
}

export default Home;
