import React from 'react'
import Logger from '../js/Logger'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/devicesWatering';

class DevicesWateringOperationalRecords extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DevicesWateringOperationalRecords'});
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.logger.log('componentWillReceiveProps', 'nextProps', nextProps);
  }

  render() {
    return (
        <div className="ui container">
          <div className="item ui header">
            灌水実績
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    selectedDevicesWateringId: state.devicesWatering.get('selectedId'),
    devicesWateringOperationalRecords: state.devicesWatering.get('operationalRecords').toJS(),
    progress: state.devicesWatering.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesWateringOperationalRecords);
