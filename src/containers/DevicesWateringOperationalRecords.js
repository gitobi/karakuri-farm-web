import React from 'react'
import Logger from '../js/Logger'
import Bastet from '../js/Bastet'

class DevicesWateringOperationalRecords extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DevicesWateringOperationalRecords'});

    this.testCallApi = this.testCallApi.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (this.props.deviceId !== nextProps.deviceId) {
      // deviceId変更時
      this.logger.info('componentWillReceiveProps', "nextProps", nextProps);
      this.testCallApi(nextProps.deviceId);
    }
  }

  testCallApi(deviceId) {
    var bastet = new Bastet()
    bastet.getWateringsOperationalRecords(deviceId).then(
      result => this.logger.log('result', result)
      ,error => this.logger.log('error', error)
    );
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

export default DevicesWateringOperationalRecords;
