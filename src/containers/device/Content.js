// @flow

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Segment, Menu, Label } from 'semantic-ui-react';

import Logger from '../../js/Logger';

import PartialLinkList from '../../components/lib/PartialLinkList';
import RouteCallback from '../../components/lib/RouteCallback';

import type {Item, Position} from '../../components/lib/PartialLinkList';
import type {RouterProps} from '../../types/BaseTypes';

type P = {
  tabs: Array<Item>,
  componentsMap: Object,
  linkPosition: Position,
  item: Object,
};
type Props = P & RouterProps
type State = {
  activeItemId: ?string
};

class Content extends Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.state = {
      activeItemId: null,
    };
  }

  onChange = (id: ?string) => {
    // TODO 保存がされてない場合は変更時に警告する
    // this.logger.log('onChange:', id);
    if (id !== this.state.activeItemId) {
      // 変更された場合
      this.setState({activeItemId: id});
    }
  }


  render() {
    // this.logger.log('render', {props: this.props, state: this.state});

    if (!this.props.item || !this.props.item.id) {
      return(<div> none item in content </div>);
    }
    const Router = (
      <Switch>
        <Route path={`${this.props.match.url}/:tab?`} render={
          ({match, history, location}) => {
            // this.logger.log('render - set', {match: match, props: this.props, state: this.state});
            const componentId = match.params.tab;
            let Comp = this.props.componentsMap[componentId];
            let item = this.props.item;
            if (!item) item = {id: null};
            // this.logger.log('render - up', {componentId: componentId, Comp: Comp, item: item});

            if (!Comp) {
              // this.logger.log('render - replace', {refs: this.refs, match: match, props: this.props, state: this.state});
              // if (this.refs['linkList']) {
              //   this.refs['linkList'].selectHead();
              // }
              return (<Segment> notfound view: {componentId} </Segment>);
            }

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
          position={this.props.linkPosition}
          match={this.props.match}
          history={this.props.history}
          location={this.props.location}
          initialActiveItemId={this.state.activeItemId}
          initialReplace={true}
          items={this.props.tabs}
          onChangeItem={this.onChange}
          ref={'linkList'}
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

export default Content;
