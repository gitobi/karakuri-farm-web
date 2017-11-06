import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';

class HomeLayout extends Component {
  render() {
    return (
      <Segment>
        {this.props.children}
      </Segment>
    )
  }
}

export default HomeLayout;
