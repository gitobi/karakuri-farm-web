import React, { Component } from 'react';
import { Grid, Menu, Label } from 'semantic-ui-react';
import Logger from '../js/Logger';
import GtbUtils from '../js/GtbUtils';
import { NavLink, Redirect } from 'react-router-dom';

export default class DeviceSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {id: null},
    };
    this.logger = new Logger({prefix: this.constructor.name});
    this.select = this.select.bind(this);
    this.menuItem = this.menuItem.bind(this);

    // this.logger.log("constructor", this.props);
  }

  componentWillMount() {
    // this.logger.log("componentWillMount", this.props);
    this.select(this.state.item, this.props.items);
  }

  componentWillReceiveProps(nextProps) {
    // this.logger.log("componentWillReceiveProps", this.props, "=>", nextProps);
    this.select(this.state.item, nextProps.items);
  }

  select(item, items = this.props.items) {
    // this.logger.log('select', item, items);
    if (0 === items.length) {
      // this.logger.log('select:a');
      // itemsがない、itemがない場合は選択を無効にする
      this.setState({
        item: {id: null},
      });
      return;
    }

    // 何も選択されていない場合は先頭要素を選択する
    if (null === this.state.item.id) {
      this.setState({
        item: items[0],
      });
    }

    if (item.id === this.state.item.id) {
      // this.logger.log('select:b');
      // 変更がない場合は設定しない
      return;
    }

    // this.logger.log('select:c', item);
    this.setState({
      item: item,
    });
    // this.logger.log('select:c');
  }

  menuItem(item, match, label) {
    let linkTo = `${this.props.basePath}/${item.id}/setting_basic`;
    // this.logger.log("linkTo", this.props.basePath, item.id, linkTo,);
    let labelContent = '';
    if (label) {
      labelContent = <Label color="teal">{label}</Label>;
    }

    // this.logger.log("render", this.state.item.id, '<=>', item.id, this.state.item.id === item.id);

    return (
      <Menu.Item
        exact={false}
        key={item.id}
        as={NavLink}
        to={linkTo}
        name={item.name}
        onClick={(event, data) => {
          this.logger.log("call select", item);
          this.select(item)
        }}
      >
        {labelContent}
        {item.name}
      </Menu.Item>
    );
  }

  render() {
    // this.logger.log('render:', this.props, this.state);
    const menuItems = this.props.items.map (item => {
      return this.menuItem(item, this.props.match);
    })
    // this.logger.log("render", this.props.itemMap, this.props.itemMap[this.props.match.params.id]);

    // if (0 !== this.props.items.length && (
    //   !this.props.match.params.id ||
    //   !this.props.itemMap[this.props.match.params.id]
    //   )) {
    //   // メニューリストが存在する状態で、以下の場合は先頭要素を選択してリダイレクトする
    //   // - urlにidが指定されてない場合
    //   // - urlに指定されたidが、リストに存在しない
    //   let pathname = `${this.props.basePath}/${this.props.items[0].id}`;
    //   this.logger.log("redirect", pathname, this.props);
    //   return (
    //     <Redirect to={pathname} from={this.props.basePath} />
    //   );

    // } else {

      const item = this.props.itemMap[this.props.match.params.id]
        ? this.props.itemMap[this.props.match.params.id]
        : {id: null}

      return (
        <div>
          <Grid columns={2}>
            <Grid.Column width={3}>
              <Menu
                fluid
                vertical
                secondary
                pointing
              >
                {menuItems}
              </Menu>
            </Grid.Column>
            <Grid.Column stretched width={13}>
              {<this.props.component
                basePath={this.props.basePath + (item.id ? "/" + item.id : "")}
                location={this.props.location}
                match={this.props.match}
                item={item}
              />}
            </Grid.Column>
          </Grid>
        </div>
      );
    // }
    // return (
    //   <div>
    //     <Grid columns={2}>
    //       <Grid.Column width={3}>
    //         <Menu
    //           fluid
    //           vertical
    //           secondary
    //           pointing
    //           items={this.state.names}
    //           onItemClick={this.change}
    //           />

    //       </Grid.Column>
    //       <Grid.Column stretched width={13}>
    //         {<this.props.component
    //           item = {this.state.item}
    //         />}
    //       </Grid.Column>
    //     </Grid>
    //   </div>
    // );
  }
}
