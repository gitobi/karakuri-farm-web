// @flow

import React, { Component } from 'react';
import { Route, Redirect, Switch, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Menu, Label } from 'semantic-ui-react';

import GtbUtils from '../../js/GtbUtils';
import Logger from '../../js/Logger';

// import DeviceLayout from '../../layouts/DeviceLayout';

import PartialLinkList from '../../components/lib/PartialLinkList';
import RouteCallback from '../../components/lib/RouteCallback';

type Props = {
  match: Object,
  history: Object,
  location: Object,

  tabs: Object;
  componentsMap: Object;
  linkPosition: Object;


  item: Object,
};

type State = {
  activeItemId: ?string
};

class Content extends Component<Props, State> {
  logger: Logger;

  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.state = {
      activeItemId: null,
    };
  }

  onChange = (id: ?string) => {
    // TODO 保存がされてない場合は変更時に警告する
    this.logger.log('onClickItem:', id);
    if (id !== this.state.activeItemId) {
      // 変更された場合
      this.setState({activeItemId: id});
    }
  }

  // createTabHeader = (element: Object) => {
  //   // this.logger.log('createMenuItem', element)
  //   let linkTo = this.props.match.url + '/' + element.linkTo;
  //   return (
  //     <Menu.Item
  //       as={Link}
  //       to={{pathname: linkTo, state: {after: '/' + element.linkTo}}}
  //       key={element.id}
  //       name={element.id}
  //       active={this.state.activeItemId === element.id}
  //       onClick={this.onClickItem}
  //     />
  //   );
  // }

  createContentRoute = (element: {
    path: string,
    id: string,
    component: Object,
    item: Object
  }) => {
    let linkTo = this.props.match.path + '/' + element.path;
    return (
      <Route
        key={element.id}
        path={linkTo}
        render={(props) => {return(
          <element.component
            item={element.item}
            {...props}
            />
          )}}
      />
    );
  }


  render() {
    this.logger.log('render', {props: this.props, state: this.state});


    if (!this.props.item || !this.props.item.id) {
      return(<div> none item in content </div>);
    }

    const items = this.props.tabs;
    const componentsMap = this.props.componentsMap;
    const position = this.props.linkPosition;

    // const items = [
    // {
    //   path: "summary",
    //   id: "summary",
    //   name: "基本設定",
    //   component: DevicesSummary,
    //   item: this.props.item
    // }, {
    //   path: "schedules",
    //   id: "schedules",
    //   name: "スケジュール",
    //   component: Schedules,
    //   item: this.props.item
    // }, {
    //   path: "operationalRecords",
    //   id: "operationalRecords",
    //   name: "潅水実績",
    //   component: OperationalRecords,
    //   item: this.props.item
    // }, {
    //   path: "stat",
    //   id: "stat",
    //   name: "統計",
    //   component: Stats,
    //   item: this.props.item
    // }, {
    //   path: "log",
    //   id: "log",
    //   name: "ログ",
    //   component: DevicesSystemLogs,
    //   item: this.props.item
    // }];

    // const componentsMap: Object = {
    //   summary: DevicesSummary,
    //   schedules: Schedules,
    //   operationalRecords: OperationalRecords,
    //   stat: Stats,
    //   log: DevicesSystemLogs
    // };

    // const menuItems = items.map(this.createTabHeader);
    const routes = items.map(this.createContentRoute);

    const Router = (
      <Switch>
        <Route path={`${this.props.match.url}/:tab?`} render={
          ({match, history, location}) => {
            this.logger.log('render - set', {match: match, props: this.props, state: this.state});
            const componentId = match.params.tab;
            let Comp = componentsMap[componentId];
            let item = this.props.item;
            if (!item) item = {id: null};
            this.logger.log('render - up', {componentId: componentId, Comp: Comp, item: item});

            if (!Comp) {
              return (<Segment> notfound view: {componentId} </Segment>);
            }

            // this.onChange(componentId);
            return (
              <RouteCallback
                onChange={this.onChange}
                params={match.params}
                paramKey={'tab'}
              >
                <Comp
                  item={item}
                  match={match}
                  history={history}
                  location={location}
                  />
              </RouteCallback>
            )
          }
        } />
      </Switch>
    );

    return (
      <div>
        <PartialLinkList
          menuProps={{
            attached: 'top',
            tabular: true
          }}
          position={position}
          //position={{section: 'waterings', keys: ['device', 'device_id', 'tab_name'], key: 'tab_name'}}
          match={this.props.match}
          history={this.props.history}
          location={this.props.location}
          initialActiveItemId={this.state.activeItemId}
          initialReplace={true}
          items={items}
          onChangeItem={this.onChange}
          />
        <Segment attached='bottom'>
          <Switch>
            {Router}
          </Switch>
        </Segment>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return (
    {
    }
  );
}

const mapDispatchToProps = {
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Content);
