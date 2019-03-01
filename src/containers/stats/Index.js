import React, { Component } from 'react';
import {Container} from 'semantic-ui-react';
import EditableTable from '../../components/common/EditableTable'
import Logger from '../../js/Logger'

import { connect } from 'react-redux';

class DevicesIndex extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    // this.logger.log(this.props)

    // テーブルのカラムレイアウト
    const columns = [{
        Header: 'ID',
        accessor: 'id',
        width: 360,
        customCell: { type: 'normal', divStyle: {textAlign: 'left'}},
      }, {
        Header: 'Name',
        accessor: 'name',
        width: 320,
        customCell: { type: 'normal', divStyle: {textAlign: 'left'}},
      }, {
        Header: 'Heartbeated at',
        accessor: 'heartbeated_at',
        width: 180,
        customCell: { type: 'normal', divStyle: {textAlign: 'left'}},
    }];

    return (
      <Container>
        <EditableTable
          label={'Devices'}
          data={this.props.devices}
          columns={columns}
          loading={this.props.progress}
          filterable={true}
          sortable={true}
          defaultPageSize={50}
          defaultSorted={[{id: 'name', desc: true}]}
        />

      </Container>
    );
  }
}

function mapStateToProps(state) {
  return  {
    devices:  state.device.getIn(['devices']).toJS(),
    progress: state.device.get('progress'),
  };
}

export default connect(
  mapStateToProps,
  null,
)(DevicesIndex);
