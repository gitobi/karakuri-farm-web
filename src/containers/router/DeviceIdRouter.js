// @flow

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';

import Logger from '../../js/Logger';

import PartialLinkList from '../../components/lib/PartialLinkList';
import RouteCallback from '../../components/lib/RouteCallback';
import HeadSelector from '../../components/lib/HeadSelector';

import GtbUtils from '../../js/GtbUtils';

import Layout from '../device/Layout';

import Watering from '../device/watering/Watering';
import DevicesPyranometers from '../DevicesPyranometers';
import Soilmoisture from '../device/soilmoisture/Soilmoisture';
import MachinesRadiationalWaterings from '../MachinesRadiationalWaterings';

import type {RouterProps} from '../../types/BaseTypes';

type P = {
  type: string,
  section: string,
  devices: Object,
  devicesMap: Object,
  progress: boolean
};
type Props = P & RouterProps
type State = {
  activeItem: Object,
  typeComponentsMap: Object
};

class DeviceIdRouter extends Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    this.state = {
      activeItem: {id: null},
      typeComponentsMap: {
        watering: Watering,
        pyranometer: DevicesPyranometers,
        soilmoisture: Soilmoisture,
        radiational_watering: MachinesRadiationalWaterings,
      }
    };
  }

  onChange = (id: ?string) => {
    this.logger.log('onChange', {id: id});
    let item = GtbUtils.find(this.props.devices, 'id', id);
    if (!item) item = {id: null}
    this.setState({activeItem: item});
  }

  render() {
    // this.logger.log('render', {props: this.props, state: this.state});

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
        position={{section: this.props.section, keys: ['device', 'device_id', 'tab_name'], key: 'device_id'}}
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
          <Route path={`${this.props.match.url}/:id`} render={({match, history, location}) => {
            // this.logger.log('render - set', {match: match, props: this.props, state: this.state});
            const id = match.params.id;
            let Comp = this.state.typeComponentsMap[this.props.type];
            let item = this.props.devicesMap[id];
            if (!item) item = {id: null};
            this.logger.log('render - up', {id: id, Comp: Comp, item: item});

            if (!Comp) {
              return (<Segment> notfound view: {this.props.type} </Segment>);
            } else if (!item.id) {
              return (<Segment> notfound device: {id} </Segment>);
            }

            return (
              <RouteCallback
                onChange={this.onChange}
                params={match.params}
                paramKey={'id'}
                items={this.props.devices}
                itemKey={'id'}
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
          }} />
          <Route path={`${this.props.match.url}/`} render={({match, history, location}) => {
            this.logger.log('render - unselected');
            return (
                    <Segment> not selected device </Segment>

              // <HeadSelector
              //   match={match}
              //   history={history}
              //   items={this.props.devices}
              //   pathParamsKey={'id'}
              // />
            );
          }} />

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
      />
    );
  }
}

export default DeviceIdRouter;
