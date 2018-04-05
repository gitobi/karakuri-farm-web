import React, { Component } from 'react';
import { Segment, Button } from 'semantic-ui-react';
import Logger from '../../js/Logger'

import Header from '../../components/part/Header'

import UserSummary from './UserSummary';
import OrganizationSummary from './OrganizationSummary';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/account';

class AccountSettings extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger({prefix: this.constructor.name});
    this.save = this.save.bind(this);
  }

  isDisableSaveButton() {
    // 変更されたデータがあるか判定
    return (0 === Object.keys(this.props.changed).length);
  }

  save(event, data) {
    // this.logger.log('onClick', event, data);
    let before_organization_id = this.props.organization.id;
    this.props.actions.save(this.props.changed)
    .then((result) => {
      // this.logger.log("saved...", result);
      if (before_organization_id !== this.props.organization.id) {
        // organizationが新規作成された場合は、userに紐付ける
        return this.props.actions.update(
          this.props.user.id,
          "organization_id",
          this.props.organization.id,
          null,
        );
      }
      return null;
    }).then((result) => {
      if (result !== null) {
        this.logger.log("re save", result, this.props.changed);
        this.props.actions.save(this.props.changed);
      }
    });
  }

  render() {
    // this.logger.log(this.props)
    return (
      <div>
        <div className='item ui header'>
          <Button as='a' onClick={this.save} loading={this.props.progress} disabled={this.props.progress || this.isDisableSaveButton()}>Save</Button>
        </div>
        <Segment loading={this.props.loading}>
          <Header label={"User"}/>
          <UserSummary item={this.props.user} />
        </Segment>

        <Segment loading={this.props.loading}>
          <Header label={"Organization"}/>
          <OrganizationSummary item={this.props.organization} />
        </Segment>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return  {
    user: state.account.get('user').toJS(),
    organization: state.account.get('organization').toJS(),
    changed: state.account.get('changed').toJS(),
    progress: state.account.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountSettings);
