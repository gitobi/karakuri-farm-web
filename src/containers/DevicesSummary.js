import React, { Component } from 'react';
import { Feed } from 'semantic-ui-react';
import Logger from '../js/Logger'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/device';

class DevicesSummary extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger({prefix: 'DevicesSummary'});
    this.createFeed = this.createFeed.bind(this);
  }

  createFeed(label, text) {
    return(
      <Feed>
        <Feed.Event>
          <Feed.Content>
            <Feed.Date>
              {label}
            </Feed.Date>
            <Feed.Summary>
              {text || '---'}
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
      </Feed>
      );
  }

  render() {
    // TODO nameを変更できるようにする
    // this.logger.log(this.props)
    return (
      <div>
        <div>
          {this.createFeed('id', this.props.device.id)}
          {this.createFeed('device_type', this.props.device.device_type)}
          {this.createFeed('name', this.props.device.name)}
          {this.createFeed('software_version', this.props.device.software_version)}
          {this.createFeed('model_number', this.props.device.model_number)}
          {this.createFeed('heartbeated_at', this.props.device.heartbeated_at)}
          {this.createFeed('inserted_at', this.props.device.inserted_at)}
          {this.createFeed('updated_at', this.props.device.updated_at)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    device: state.device.get('selectedDevice').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesSummary);
