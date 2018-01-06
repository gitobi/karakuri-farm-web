import React, { Component } from 'react';
import { Feed } from 'semantic-ui-react';

class Field extends Component {
  render() {
    return (
      <Feed>
        <Feed.Event>
          <Feed.Content>
            <Feed.Date>
              {this.props.label}
            </Feed.Date>
            <Feed.Summary>
              {this.props.text}
              {this.props.children}
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
      </Feed>
    );
  }
}

export default Field;
