// @flow

import React, { Component } from 'react';
import {Container, List as UIList, Checkbox, Button} from 'semantic-ui-react';
import Logger from '../../js/Logger'

type Props = {
  items: Array<Object>,
  progress: boolean,
  onChanged?: Function,
};
type State = {
  checkedIds: Array<String>
};

class List extends Component<Props, State> {
  logger: Logger;

  constructor(props: Props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.state = {
      checkedIds: []
    };
  }

  checkAll = () => {
    // this.logger.log('checkAll:');
    let checkedIds = [];
    if (this.state.checkedIds.length !== this.props.items.length) {
      // 全選択されていない場合は全選択
      checkedIds = this.props.items.map(item => item.id)
    }
    this.setState({checkedIds: checkedIds});

    if (this.props.onChanged) {
      this.props.onChanged(checkedIds);
    }
  }

  onChange = (e: Object, data: Object) => {
    // this.logger.log('onChange:', e, data);
    let changed = false;
    let checkedIds = this.state.checkedIds;
    if (data.checked && !checkedIds.includes(data.id)) {
      changed = true;
      checkedIds.push(data.id);
      this.setState({checkedIds: checkedIds});

    } else if (!data.checked && checkedIds.includes(data.id)) {
      changed = true;
      checkedIds = checkedIds.filter(item => item !== data.id);
      this.setState({checkedIds: checkedIds});
    }

    if (changed && this.props.onChanged) {
      this.props.onChanged(checkedIds);
    }
  }

  render() {
    // this.logger.log(this.props)

    // テーブルのカラムレイアウト
    const listItems = (
      this.props.items.map(item => {
        return (
          <UIList.Item key={item.id}>
            <UIList.Icon name='marker' />
            <UIList.Content>
              <Checkbox
                id={item.id}
                label={item.name}
                checked={this.state.checkedIds.includes(item.id)}
                onChange={this.onChange}
              />
            </UIList.Content>
          </UIList.Item>
        );
      })
    );


    return (
      <Container>
        <Button onClick={this.checkAll}>All</Button>
        <UIList>
          {listItems}
        </UIList>
      </Container>
    );
  }
}


export default List;
