import React from 'react'
import Logger from '../js/Logger'

class DevicesWateringOperationalRecords extends React.Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: 'DevicesWateringOperationalRecords'});
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
