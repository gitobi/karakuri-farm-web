// @flow
import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import Logger from '../../js/Logger';

type Props = {
  match: Object,
  history: Object,
  items: Array<Object>,
  pathParamsKey: string
};

type State = {
  selected: ?string,
  pathname: ?string
};

export default class HeadSelector extends Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.state = {
      selected: null,
      pathname: null
    };
    this.logger.log('constructed:', {props: props, state: this.state});
  }

  componentDidMount = () => {
    this.logger.log('componentDidMount:', {props: this.props, state: this.state});

    if (!this.state.selected
      && this.props.items
      && 0 <this.props.items.length) {
      this.historyReplace();
    }

  }

  componentDidUpdate = (prevProp: Props, prevState: State) => {
    this.logger.log('componentDidUpdate:', {prevProp: prevProp, props: this.props, prevState: prevState, state: this.state});


    if (!this.state.selected
      && this.props.items
      && 0 <this.props.items.length
      && JSON.stringify(prevProp.items) !== JSON.stringify(this.props.items)) {

      this.historyReplace();
      // const selected = this.props.items[0];
      // const relative = (this.props.match.url.endsWith('/') ? '' : '/') + selected[this.props.pathParamsKey];
      // const pathname = this.props.match.url + relative;

      // this.logger.log('componentDidUpdate:', {selected: selected, relative: relative, pathname: pathname});

      // this.setState({
      //   selected: selected,
      //   pathname: pathname
      // });
      // this.props.history.replace(pathname);
      // this.props.onChange(nextValue);
    }

    // if (nextValue !== prevState.value) {
    //   this.setState({value: nextValue});
    //   this.props.onChange(nextValue);
    // }
  }

  historyReplace = () => {
    const selected = this.props.items[0];
    const relative = (this.props.match.url.endsWith('/') ? '' : '/') + selected[this.props.pathParamsKey];
    const pathname = this.props.match.url + relative;

    this.logger.log('componentDidUpdate:', {selected: selected, relative: relative, pathname: pathname});

    this.setState({
      selected: selected,
      pathname: pathname
    });
    this.props.history.replace(pathname);

  }

  render() {
    this.logger.log('render', {props: this.props, state: this.state});
    return (
      <Segment> not selected device </Segment>
    );
  }

}
