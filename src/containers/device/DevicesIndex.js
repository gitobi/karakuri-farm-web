import React, { Component } from 'react';
import Logger from '../../js/Logger'

import DevicesIndexItem from '../../components/device/DevicesIndexItem'

import { connect } from 'react-redux';

class DevicesIndex extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    // this.logger.log(this.props)

    const indexItems = [];
    for (var i in this.props.devices) {
      let item = this.props.devices[i];
      indexItems.push(
          <DevicesIndexItem key={item.id} item={item}/>
        );
    }

    return (
      <div>
        {indexItems}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    devices: state.device.getIn(['devices']).toJS(),
  };
}

export default connect(
  mapStateToProps,
  null,
)(DevicesIndex);
