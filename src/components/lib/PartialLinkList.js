// @flow
import React, { Component } from 'react';
import { Menu, Label, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PartialLink from './PartialLink';
import Logger from '../../js/Logger';
import GtbUtils from '../../js/GtbUtils';

export type Position = {
  section: string,
  keys: Array<string>,
  key: string
};

export type Item = {
  id: string,
  path: string,
  name: string,
  label?: string,
  position?: Position
};

type Props = {
  match: Object,
  history: Object,
  location: Object,

  position?: Position,
  items: Array<Item>,

  onChangeItem?: (id: ?string) => void,
  initialActiveItemId?: ?string,
  initialReplace?: boolean,

  menuProps?: Object,
  nested?: boolean,

  progress?: boolean
};

type State = {
  initialActiveItemId: ?string,
  initialSelected: boolean,
  linkToObjectMap: Object,
  activeItemId: ?string,
  needReplace: boolean
};


export default class PartialLinkList extends Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});

    let initialActiveItemId = props.initialActiveItemId ? props.initialActiveItemId : null;
    // let activeItemId = GtbUtils.findOrHead(props.items, 'id', initialActiveItemId);
    this.state = {
      initialActiveItemId: initialActiveItemId,
      initialSelected: false,
      activeItemId: null,
      linkToObjectMap: {},
      needReplace: false
    };
    // this.logger.log('constructed!', {props: props, state: this.state});
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    // new Logger({prefix: "PartialLinkList"}).log('getDerivedStateFromProps:', prevState, '->', nextProps);

    let returnObject: Object = {needReplace: false};

    let initialActiveItemId = prevState.initialActiveItemId;
    if (nextProps.initialActiveItemId !== undefined
      && nextProps.initialActiveItemId !== prevState.initialActiveItemId) {
      // 初期値の変更があった場合
      // これはURL直打ちによるroute決定により行われる
      new Logger({prefix: "PartialLinkList"}).log('getDerivedStateFromProps: change initial', nextProps.position, prevState.initialActiveItemId, '->', nextProps.initialActiveItemId);

      initialActiveItemId = nextProps.initialActiveItemId;
      returnObject['initialActiveItemId'] = initialActiveItemId;
      returnObject['activeItemId'] = initialActiveItemId;
      return returnObject;
    }

    // if (prevState.activeItemId !== null) {
    //   // 現在選択中の場合は、新規item中にも現在のアイテムが存在していることを確認する
    //   if(GtbUtils.find(nextProps.items, 'id', prevState.activeItemId)) {
    //     // 選択を変更しない
    //     return returnObject;
    //   }
    // }

    return null;

    // // 現在選択中であり、新規item中に現在のアイテムが存在しない場合　及び　現在未選択の場合は、
    // // 新規itemsから、初期値または先頭を選択する
    // let nextActiveItemId = GtbUtils.findOrHead(nextProps.items, 'id', initialActiveItemId);
    // if (nextActiveItemId !== prevState.activeItemId) {
    //   new Logger({prefix: "PartialLinkList"}).log('getDerivedStateFromProps:', prevState.activeItemId, '->', nextActiveItemId);
    //   // 選択を変更すべき場合
    //   returnObject['activeItemId'] = nextActiveItemId;
    //   returnObject['needReplace'] = true;
    //   return returnObject;
    // }
    // return returnObject;
  }

  componentDidUpdate = (prevProps: Props, prevState: State) => {
    if (this.props.position && this.props.position.key === 'device_id') {
      this.logger.log('componentDidUpdate:', {prevProps: prevProps, prevState: prevState, props: this.props, state: this.state});
    }

    if ((prevProps.progress && !this.props.progress)
      && (JSON.stringify(this.props.items) !== JSON.stringify(prevProps.items))) {
      let nextActiveItemId = GtbUtils.findOrHead(this.props.items, 'id', this.state.activeItemId);
      this.logger.log('componentDidUpdate: next', nextActiveItemId);
    }

    // if (!prevState.initialSelected && this.state.initialSelected && this.state.activeItemId) {
    if (this.state.needReplace && (this.state.activeItemId !== prevState.activeItemId)) {
      // 初期選択がまだの状態で、初期設定指示が来た場合
      // this.historyReplace();
    }
  }

  // selectHead = () => {
  //   if (0 < this.props.items.length) {
  //     this.historyReplace(this.props.items[0].id);
  //   }
  // }

  // historyReplaceActiveItem = () => {
  //   if (this.state.activeItemId) {
  //     this.historyReplace(this.state.activeItemId);
  //   } else {
  //     this.logger.log('historyReplace:', this.props.match.url);
  //     this.props.history.replace(this.props.match.url);
  //   }
  // }

  // historyReplace = (itemId: string) => {
  //   let linkToObject = this.refs[`ref-${itemId}`].getLinkToObject();
  //   this.logger.log('historyReplace:', linkToObject);
  //   if (this.props.onChangeItem) {
  //     this.props.onChangeItem(this.state.activeItemId);
  //   }
  //   this.props.history.replace(linkToObject.pathname, linkToObject.state);
  // }

  onClickItem = (item: Object) => {
    // TODO 保存がされてない場合は変更時に警告する
    // this.logger.log('onClickItem:', {item: item, props: this.props, state: this.state});
    let propsItem = GtbUtils.find(this.props.items, 'id', item.id);
    if (propsItem.id !== this.state.activeItemId) {
      // 変更された場合
      this.setState({activeItemId: propsItem.id});
      if (this.props.onChangeItem) {
        this.props.onChangeItem(propsItem.id);
      }
    }
  }

  linkToObjectCallback = (id: string, linkToObject: Object) => {
    let map = this.state.linkToObjectMap;
    map[id] = linkToObject;
    this.setState({linkToObjectMap: map});
  }

  render() {

    const menuItems = this.props.items.map((item) => {
      let pos = this.props.position ? this.props.position : {section: 'unknown', keys: ['unknown'], key: 'unknown'};
      if (item.position) {
        pos = item.position;
      }
      return (
        <PartialLink
          key={item.id}
          match={this.props.match}
          history={this.props.history}
          location={this.props.location}
          position={pos}
          item={item}
          onClickItem={this.onClickItem}
          active={this.state.activeItemId === item.id}
          ref={`ref-${item.id}`}
          />
      )});

    if (this.props.nested) {
      return (
        <Menu.Menu {...this.props.menuProps}>
{/*          <Loader active={this.props.progress} inline />
*/}          {menuItems}
        </Menu.Menu>
      );
    } else {
      return (
        <Menu {...this.props.menuProps}>
{/*          <Loader active={this.props.progress} inline />
*/}          {menuItems}
        </Menu>
      );
    }
  }

}
