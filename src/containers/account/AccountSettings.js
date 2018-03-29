import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import Logger from '../../js/Logger'

import Header from '../../components/part/Header'

import UserSummary from './UserSummary';

import { connect } from 'react-redux';

class AccountSettings extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    // this.logger.log(this.props)
    return (
      <div>
        <Segment loading={this.props.loading}>

          <Header label={"User"}/>
          <UserSummary item={this.props.user} />

        </Segment>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    user: state.account.get('user').toJS(),
    progress: state.account.get('progress'),
  };
}

export default connect(
  mapStateToProps,
  null
)(AccountSettings);
