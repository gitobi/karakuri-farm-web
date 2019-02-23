// @flow

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';

import Logger from '../../js/Logger';

import PartialLinkList from '../../components/lib/PartialLinkList';
import RouteCallback from '../../components/lib/RouteCallback';

import GtbUtils from '../../js/GtbUtils';

import DeviceLayout from '../../layouts/DeviceLayout';
import Layout from '../device/Layout';

import Waterings from '../device/waterings/Waterings';
import DevicesWaterings from '../DevicesWaterings';
import DevicesPyranometers from '../DevicesPyranometers';
import DevicesSoilmoisture from '../device/soilmoisture/Soilmoisture';
import MachinesRadiationalWaterings from '../MachinesRadiationalWaterings';

import * as Type from '../../types/BaseTypes'

type Props = {
  match: Object,
  history: Object,
  location: Object,

  type: string,
  component: Class<Component<Object, Object>>,
  devices: Object,
  devicesMap: Object,
  progress: boolean,

};

type State = {
  activeItem: Object,
  typeComponentsMap: Object
};

class DeviceIdRouter extends Component<Props, State> {
  logger: Logger;

  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.state = {
      activeItem: {id: null},
      typeComponentsMap: {
        watering: Waterings,
        pyranometer: DevicesPyranometers,
        soilmoisture: DevicesSoilmoisture,
        radiational_watering: MachinesRadiationalWaterings,
      }

    };

  }

  onChange = (id: ?string) => {
    let item = GtbUtils.find(this.props.devices, 'id', id);
    if (!item) item = {id: null}
    this.setState({activeItem: item});
  }

  render() {
    this.logger.log('render', {props: this.props, state: this.state});
    // let Comp = this.props.component;

    const listItems = this.props.devices.map((item) => {
      return {
        id: item.id,
        path: item.id,
        name: item.name
      }
    });

    const DeviceList = (
      <PartialLinkList
        menuProps={{
          fluid: true,
          vertical: true,
          secondary: true,
          pointing: true
        }}
        position={{section: 'waterings', keys: ['device', 'device_id', 'tab_name'], key: 'device_id'}}
        match={this.props.match}
        history={this.props.history}
        location={this.props.location}
        initialActiveItemId={this.state.activeItem.id}
        initialReplace={true}
        items={listItems}
        onChangeItem={this.onChange}
        progress={this.props.progress}
      />
    );

    const Router = (
        <Switch>
          <Route path={`${this.props.match.url}/:id?`} render={
            ({match, history, location}) => {
              this.logger.log('render - set', {match: match, props: this.props, state: this.state});
              const id = match.params.id;
              let Comp = this.state.typeComponentsMap[this.props.type];
              let item = this.props.devicesMap[id];
              if (!item) item = {id: null};
              this.logger.log('render - up', {id: id, Comp: Comp, item: item});

              if (!Comp) {
                return (<Segment> notfound view: {this.props.type} </Segment>);
              } else if (!item.id) {
                return (<Segment> notfound device: {id} </Segment>);
              } else if (!id) {
                return (<Segment> not selected device </Segment>);
              }

              return (
              <RouteCallback
                onChange={this.onChange}
                params={match.params}
                paramKey={'id'}
              >
                <Comp
                  type={this.props.type}
                  id={id}
                  item={item}
                  items={this.props.devices}
                  itemMap={this.props.devicesMap}
                  match={match}
                  history={history}
                  location={location}
                />
              </RouteCallback>
              );
            }
        } />
        </Switch>
    );

    return (
      <Layout
        match={this.props.match}
        history={this.props.history}
        location={this.props.location}

        items={this.props.devices}

        left={DeviceList}
        right={Router}
      >
{/*
        {Router}
      */}
{/*        <Switch>
          <Route path={`${this.props.match.url}/:id?`} render={
            ({match, history, location}) => {
              this.logger.log('render - set', {match: match, props: this.props, state: this.state});
              const id = match.params.id;
              let Comp = this.state.typeComponentsMap[this.props.type];
              let item = this.props.devicesMap[id];
              if (!item) item = {id: null};
              this.logger.log('render - up', {id: id, Comp: Comp, item: item});

              if (!Comp) {

              }

              return (
                <Comp
                  type={this.props.type}
                  id={id}
                  item={item}
                  items={this.props.devices}
                  itemMap={this.props.devicesMap}
                  match={match}
                  history={history}
                  location={location}
                  />)}
            } />
        </Switch>
*/}
      </Layout>
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
)(DeviceIdRouter);
