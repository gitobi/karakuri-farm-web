// @flow
import React, { Component } from 'react';
import { Menu, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Logger from '../../js/Logger';
import { Map, List, fromJS } from 'immutable';

type Position ={
  section: string,
  keys: Array<string>,
  key: string
};

type LinkToObject ={
  pathname: string,
  state: Object
};

type Item = {
  id: string,
  path: string,
  name: string,
  label?: string
};

type Props = {
  match: Object,
  history: Object,
  location: Object,
  position: Position,
  item: Item,
  active: boolean,
  onClickItem: (item: Item) => void,
  // linkToObjectCallback: (id: string, linkToObject: Object) => void
};

type State = {
  linkToObject: LinkToObject
};


export default class PartialLink extends Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.state = {
      linkToObject: {}
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    // new Logger({prefix: "PartialLink"}).log('getDerivedStateFromProps:', prevState, '->', nextProps);
    let linkToObject = PartialLink.createLinkToObject(
      nextProps.match,
      nextProps.location,
      nextProps.position,
      nextProps.item.id);
    if (JSON.stringify(linkToObject) !== JSON.stringify(prevState.linkToObject)) {
      return {linkToObject: linkToObject};
    }
    return null;
  }

  // componentDidUpdate = (prevProp: Props, prevState: State) => {
  //   this.logger.log('componentDidUpdate:', {props: this.props, state: this.state});
  //   let linkToObject = this.createLinkToObject(this.props.match, this.props.location, this.props.item.id);
  //   if (JSON.stringify(linkToObject) !== JSON.stringify(this.state.linkToObject)) {
  //     this.
  //   }
  // }

  static createLinkToObject(match: Object, location: Object, position: Position, path: string) {
    // let logger = new Logger({prefix: "PartialLink"});
    // logger.log('createLinkToObject:', path, {match: match, location: location, position: position});

    let relativePath = (match.url.endsWith('/') ? '' : '/') + path;
    let absolutePath = match.url + relativePath;

    let locationState;
    if (!location
      || !location.state) {
      locationState = fromJS({});
    } else {
      locationState = fromJS(location.state);
    }

    let locationStatePosition = locationState.get('position', Map({})).toJS();
    // logger.log('locationStatePosition:', locationStatePosition);
    let section = locationStatePosition[position.section] ? locationStatePosition[position.section] : {};
    // logger.log('section:', section);
    section[position.key] = relativePath;
    // logger.log('section:', section);

    let tail = '';
    let isTail = false;
    for (let p of position.keys) {
      if (isTail && section[p]) {
        tail = tail + section[p];
      } else {
        if (p === position.key) {
          isTail = true;
        }
      }
    }

    let linkTo = absolutePath + tail;

    // relativePath: /xxx-xxx
    // absolutePath: /device/xxx-xxx
    // linkTo:       /device/xxx-xxx/stat/desc

    locationState = locationState.setIn(['position', position.section], section);
    let obj = {
      pathname: linkTo,
      state: locationState.toJS()
    };

    // logger.log('createLinkToObject', {obj: obj});
    return obj;
  }

  createLabel = (item: Item) => {
    let label = '';
    if (item.label) {
      label = <Label color="teal">{item.label}</Label>;
    }
    return label;
  }

  getLinkToObject = () => {
    return this.state.linkToObject;
  }

  render() {
    let label = this.createLabel(this.props.item);
    // let linkToObject = this.createLinkToObject(this.props.match, this.props.location, this.props.item.id);
    // this.setState({linkToObject: linkToObject});
    // this.props.linkToObjectCallback(this.props.item.id, linkToObject);

    // this.logger.log('render', {linkTo: linkToObject, props: this.props, state: this.state});
    return (
      <Menu.Item
        as={Link}
        to={this.state.linkToObject}
        key={this.props.item.id}
        name={this.props.item.id}
        active={this.props.active}
        onClick={()=>{this.props.onClickItem(this.props.item)}}
      >
        {label}
        {this.props.item.name}
      </Menu.Item>
    );
  }

}
