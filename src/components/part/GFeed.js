import React, { Component } from 'react';
import { Feed as _Feed } from 'semantic-ui-react';

export default class GFeed extends Component {
  render() {
    return (
      <_Feed>
        <_Feed.Event>
          <_Feed.Content>
            <_Feed.Date>
              {this.props.label}
            </_Feed.Date>
            <_Feed.Summary>
              {this.props.text || '---'}
            </_Feed.Summary>
          </_Feed.Content>
        </_Feed.Event>
      </_Feed>
    );
  }
}

// console.log('f:', Feed);
// export default GFeed;
