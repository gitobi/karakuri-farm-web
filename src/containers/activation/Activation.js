import React, { Component } from 'react';
import { Segment, Button } from 'semantic-ui-react';
import Logger from '../../js/Logger'

import Header from '../../components/part/Header'
import Field from '../../components/part/Field';
import Input from '../../components/part/Input';


class Activation extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {
    // this.logger.log(this.props)
    return (
      <div>
        <Segment loading={this.props.loading}>
          <Header label={"デバイス登録"}/>
          <Field label='アクティベーション コード'>
            <Input size='large' fluid value=""/>
          </Field>
          <div className='item ui header'>
            <Button as='a'>登録</Button>
          </div>
        </Segment>
      </div>
    );
  }
}


export default Activation;
