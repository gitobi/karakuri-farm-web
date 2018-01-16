import Logger from './Logger'
import request from 'superagent'

export default class Bastet {

  constructor() {
    this.logger = new Logger({prefix: this.constructor.name});
    this.host = process.env.REACT_APP_BASTET_HOST_URL;
  }

  getDevices(id=null) {
    // 一括で取るapiがないため、別々にとって結合する
    const promises = [
      this.getDevicesWaterings(),
      this.getDevicesPyranometers(),
    ];

    // 結合
    return Promise.all(promises)
      .then((results) => {
        var list = [];
        results.forEach((element, index, array) => {
          list = list.concat(element);
        });
        return list;
      });
  }

  getDevicesWaterings(id=null) {
    var url = this.host + '/devices/waterings/';
    return this.callApi(this.get, url)
      .then((data) => {
        return data.data.map((value, index, array) => {
          value["_type"] = value.device_type;
          return value;
        });
      });
  }

  getDevicesPyranometers(id=null) {
    var url = this.host + '/devices/pyranometers/';
    return this.callApi(this.get, url)
      .then((data) => {
        return data.data.map((value, index, array) => {
          value["_type"] = value.device_type;
          return value;
        });
      });
  }

  getMachines(id=null) {
    // 一括で取るapiがないため、別々にとって結合する
    const promises = [
      this.getMachinesRadiationalWaterings(),
    ];

    // 結合
    return Promise.all(promises)
      .then((results) => {
        var list = [];
        results.forEach((element, index, array) => {
          list = list.concat(element);
        });
        return list;
      });
  }

  getMachinesRadiationalWaterings(id=null) {
    // TODO urlを変える
    var url = this.host + '/devices/pyranometers/';
    // var url = this.host + '/machines/radiational_waterings/';
    return this.callApi(this.get, url)
      .then((data) => {
        return [{
          'id': "fa6ba60e-da70-4fd3-a2b3-0d617704c958",
          'name': "rw1",
          '_type': "radiationalWatering",
          'watering_id': "b8f993b2-a417-401b-8de9-be52ff4ce8db",
          'pyranometer_id': "e969203f-c7c2-48f9-a1d0-2d7d9c591d50",
          'heartbeated_at': "2017-12-30T00:14:32.623528",
          'inserted_at': "2017-12-30T00:12:32.623528",
          'updated_at': "2017-12-30T00:13:32.548988",
        }, {
          'name': "rw2",
          'id': "48873a1c-60da-4a9f-af52-de35af124126",
          '_type': "radiationalWatering",
          'watering_id': "f0d99dc6-ba36-4ffb-85a9-6b2ffb1c72f5",
          'pyranometer_id': "1a03ca8c-929e-459e-9740-f9debfc990c9",
          'heartbeated_at': "2017-12-30T00:24:32.623528",
          'inserted_at': "2017-12-30T00:22:32.623528",
          'updated_at': "2017-12-30T00:23:32.548988",
        }];
      });
  }

  updateDevice(id, data) {
    var url = this.host + '/devices/' + id;
    return this.callApi(this.put, url, data);
  }

  updateMachine(id, data) {
    var url = this.host + '/machines/' + id;
    return this.callApi(this.put, url, data);
  }

  /////

  getWateringsSchedules(deviceId) {
    var url = this.host + '/devices/waterings/' + deviceId + '/schedules';
    return this.callApi(this.get, url);
  }

  createWateringsSchedule(deviceId, data) {
    var url = this.host + '/devices/waterings/' + deviceId + '/schedules/';
    return this.callApi(this.post, url, {schedule: data});
  }

  updateWateringsSchedule(deviceId, data) {
    var url = this.host + '/devices/waterings/' + deviceId + '/schedules/' + data.id;
    return this.callApi(this.put, url, {schedule: data});
  }

  deleteWateringsSchedule(deviceId, data) {
    var url = this.host + '/devices/waterings/' + deviceId + '/schedules/' + data.id;
    return this.callApi(this.delete, url);
  }

  /////

  getRadiationalWateringsConfigurations(machineId) {
    // TODO urlを変える
    var url = this.host + '/devices/pyranometers/';
    // var url = this.host + '/machines/radiational_waterings/' + machineId + '/configurations/';
    return this.callApi(this.get, url)
      .then((data) => {
        return {data: [{
          'id': "59d6969a-2d0d-4637-afbd-7cd7e333a074",
          'name': "rw1-1",
          'radiational_watering_id': "fa6ba60e-da70-4fd3-a2b3-0d617704c958",
          'interval': "2400",
          'slope': "4000",
          'duration': "360",
          'enable': true,
          'inserted_at': "2017-12-30T00:12:32.623528",
          'updated_at': "2017-12-30T00:13:32.548988",
        }, {
          'id': "4fc8726a-3ee6-42fb-9332-b841928c10a2",
          'name': "rw1-2",
          'radiational_watering_id': "fa6ba60e-da70-4fd3-a2b3-0d617704c958",
          'interval': "2401",
          'slope': "4001",
          'duration': "361",
          'enable': false,
          'inserted_at': "2017-12-30T00:22:32.623528",
          'updated_at': "2017-12-30T00:23:32.548988",
        }]};
      });
  }

  createRadiationalWateringsConfigurations(machineId, data) {
    var url = this.host + '/machines/radiational_waterings/' + machineId + '/configurations/';
    return this.callApi(this.post, url, {radiationalWaterings: data});
  }

  updateRadiationalWateringsConfigurations(machineId, data) {
    var url = this.host + '/machines/radiational_waterings/' + machineId + '/configurations/' + data.id;
    return this.callApi(this.put, url, {radiationalWaterings: data});
  }

  deleteRadiationalWateringsConfigurations(machineId, data) {
    var url = this.host + '/machines/radiational_waterings/' + machineId + '/configurations/' + data.id;
    return this.callApi(this.delete, url);
  }

  /////

  getWateringsOperationalRecords(wateringsId) {
    var url = this.host + '/devices/waterings/' + wateringsId + '/operational_records';
    return this.callApi(this.get, url);
  }

  getPyranometersSensingRecords(pyranometersId) {
    var url = this.host + '/devices/pyranometers/' + pyranometersId + '/sensing_records';
    return this.callApi(this.get, url);
  }

  getDevicesSystemLogs(deviceId) {
    var url = this.host + '/devices/' + deviceId + '/system_logs';
    return this.callApi(this.get, url);
  }

  ///// lowlevel functions
  callApi(api, url, query={}) {
    return api(url, query)
      .then((data) => {
        // this.logger.log('url', url);
        // this.logger.log('query', query);
        // this.logger.log('response', data);
        return(data.body);

      }).catch((err) => {
        if (err.status !== 404) {
          this.logger.error('url', url);
          this.logger.error('query', query);
          this.logger.error('error', err);
        }
        throw new Error(err);
      });
  }

  /// [ex.]
  // url1 = "foo";
  // url2 = "bar";
  // query = {column1: 'aaa', column2: 'aaa'}
  // get(url1, query)
  //   .then((data) => {
  //     console.debug(url1 + ": " + data);
  //     return get(url2);
  //   }).then((data) => {
  //     console.debug(url2 + ": " + data);
  //   }).catch((err) => {
  //     console.error(err);
  //   });
  get(url, query={}) {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .set('Content-Type', 'application/json')
        .query(query)
        .then((data) => {
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
  }

  post(url, query={}) {
    return new Promise((resolve, reject) => {
      request
        .post(url)
        .set('Content-Type', 'application/json')
        .send(query)
        .then((data) => {
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
  }

  put(url, query={}) {
    return new Promise((resolve, reject) => {
      request
        .put(url)
        .set('Content-Type', 'application/json')
        .send(query)
        .then((data) => {
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
  }

  delete(url, query={}) {
    return new Promise((resolve, reject) => {
      request
        .delete(url)
        .set('Content-Type', 'application/json')
        .send(query)
        .then((data) => {
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
  }
}
