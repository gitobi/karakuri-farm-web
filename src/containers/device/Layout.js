// @flow

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Grid, Segment } from 'semantic-ui-react';
import Logger from '../../js/Logger';
import GtbUtils from '../../js/GtbUtils';
// import DeviceList from './DeviceList';
// import DeviceRouter from './router/DeviceRouter';
import PartialLinkList from '../../components/lib/PartialLinkList';


type RouterProps = {
  match: Object,
  history: Object,
  location: Object,
};

type ComponentProps = {
  // component: Object,
  // router: Object,

  // type: string,
  items: Array<Object>,
  // itemMap: Object
  // children: Object,
  // progress: boolean,

  left: Object,
  right: Object
};

type Props = RouterProps & ComponentProps;

type State = {
  activeItem: Object
};

export default class Layout extends Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.state = {
      activeItem: {id: null},
    };
    this.logger = new Logger({prefix: this.constructor.name});
    this.logger.log('constructed!');
  }

  change = (id: ?string) => {
    let item = GtbUtils.find(this.props.items, 'id', id);
    this.setState({activeItem: item});
  }

  render() {
    this.logger.log('render', {props: this.props, state: this.state});
    // let Rout = this.props.router;
    // let Comp = this.props.component;

    // const items = this.props.items.map((item) => {
    //   return {
    //     id: item.id,
    //     path: item.id,
    //     name: item.name
    //   }
    // });

    // const DeviceList = (
    //   <PartialLinkList
    //     menuProps={{
    //       fluid: true,
    //       vertical: true,
    //       secondary: true,
    //       pointing: true
    //     }}
    //     position={{section: 'waterings', keys: ['device', 'device_id', 'tab_name'], key: 'device_id'}}
    //     match={this.props.match}
    //     history={this.props.history}
    //     location={this.props.location}
    //     initialActiveItemId={this.state.activeItem.id}
    //     initialReplace={true}
    //     items={items}
    //     onChangeItem={this.change}
    //     progress={this.props.progress}
    //   />
    // );

    // const DeviceRouter = (
    //   <Switch>
    //     <Route path={`${this.props.match.url}/:id`} render={(props) => {
    //       let itemId = props.match.params.id;
    //       let item = GtbUtils.find(this.props.items, 'id', itemId);
    //       if (item) {
    //         return (<Comp item={this.state.activeItem} {...props}/>);
    //       } else {
    //         // パスで指定されたデバイスが存在しない
    //         return (<Segment> notfound device: {itemId} </Segment>);
    //       }
    //     }} />
    //     <Route path={`${this.props.match.url}/`} render={(prop) => {
    //       return (<Segment> none devices </Segment>);
    //     }} />
    //   </Switch>
    // );

    return (
      <div>
        <Grid columns={2}>
          <Grid.Column width={3}>

            {this.props.left}

{/*            {DeviceList}
*/}

{/*            <DeviceList
              match={this.props.match}
              history={this.props.history}
              location={this.props.location}

              items={this.props.items}
              onChangeItem={this.change}
              />
*/}
          </Grid.Column>
          <Grid.Column stretched width={13}>
            {this.props.right}
{/*
            {<Comp
              item = {this.state.activeItem}
              match={this.props.match}
              history={this.props.history}
            />}
*/}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

