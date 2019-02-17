import React, { Component } from 'react';
import {
  Container,
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react';
import HomeLayout from '../../layouts/HomeLayout';

class Home extends Component {
  render() {
    return(
      <HomeLayout>
        <Segment
          style={{ padding: '8em 0em' }}
          textAlign='center'
          vertical >
          <Container>
            <Header
              as='h1'
              content='からくりファーム' />
            <p>IoTとAIが支援する、まったく新しい農業のための栽培自動化システム</p>
          </Container>
        </Segment>
        <Segment
          vertical >
          <Grid
            container>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header
                  as='h2'
                  textAlign='center'
                  content='からくりファーム' />
                <p>からくりファームはGitobi Cosmo Devicesを利用した、栽培自動化システムです。</p>
                <p>そのコアとなるテクノロジーはAIであり、計測したデータを用いて最適な栽培方法を見つけ出し、栽培管理を行います。</p>
              </Grid.Column>
              <Grid.Column width={8}>
                <Header
                  as='h2'
                  textAlign='center'
                  content='Gitobi Cosmo Devices' />
                <Header
                  as='h3'
                  textAlign='center'
                  content='JORO' />
                <p>IoT灌水装置である「JORO」は水の制御に特化したデバイスです。スマホから操作でき、データはすべてクラウドに保存されます。</p>
                <Header
                  as='h3'
                  textAlign='center'
                  content='JUKO' />
                <p>IoT日射計である「JUKO」は日射量の計測に特化したデバイスです。デバイスを置くだけで日射量を計測し、クラウド上に計測データを記録し続けます。</p>
                <Header
                  as='h3'
                  textAlign='center'
                  content='KAERU' />
                <p>IoT土壌水分計である「KAERU」は土の体積含水率の計測に特化したデバイスです。デバイスを土に埋めるだけで体積含水率を計測し、クラウド上に計測データを記録し続けます。</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </HomeLayout>
    );
  }
}

export default Home;
