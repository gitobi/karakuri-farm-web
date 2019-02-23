import React, { Component } from 'react';
export default class LayoutDoc extends Component {
  render() {
    return (
      <AppRoute>
        <Router>
          <Route Home>
          <Route Signup>
          <Route Confirm>
          <Route Login>
          <Route AppLayout>
            <Route Alert>
            <Route Devices>
            <Route Stats>
            <Route Account>
            <Route Activate>
            <Route Device/Machine>
              <DeviceLayout>
                <Route Waterings/Pyranometer ...>
                  <DeviceList>
                  <DeviceContent>
                    <Route Summary>
                    <Route Schedule/Setting>
                    <Route OperationalRecords/SensingRecords>
                    <Route Stats>
                    <Route Log>

      <Base>
        <Home>

      <Base>
        <Signup>

      <Base>
        <Confirm>

      <Base>
        <Login>

      <Base>
        <App>
          <Menu>
          <Content>

      "                                   " <Base>
      "/app/                              "   <App>
      "/app/                              "     <Menu>
      "/app/                              "     <Content>
      "/app/devices/waterings/            "       <DeviceList>
      "/app/devices/waterings/            "       <DeviceContent>
      "/app/devices/waterings/xxx-xxx/    "         <Tab>
      "/app/devices/waterings/xxx-xxx/stat"         <TabContent>


    "/app/devices/waterings/xxx-xxx/stat"

    );
  }
}
