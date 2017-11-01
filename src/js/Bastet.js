import Logger from './Logger'
import request from 'superagent'

export default class Bastet {

  constructor() {
    this.logger = new Logger({prefix: 'Bastet'});
    this.host = 'http://localhost:4000';
    // this.host = 'http://bastet-production.herokuapp.com';
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
          var type = "waterings";
          value["type"] = type;
          value["key"] = type + value["id"];
          return value;
        });
      });
  }

  getDevicesPyranometers(id=null) {
    var url = this.host + '/devices/pyranometers/';
    return this.callApi(this.get, url)
      .then((data) => {
        return data.data.map((value, index, array) => {
          var type = "pyranometers";
          value["type"] = type;
          value["key"] = type + value["id"];
          return value;
        });
      });
  }

  getWateringsSchedules(wateringsId) {
    var url = this.host + '/devices/waterings/' + wateringsId + '/schedules';
    return this.callApi(this.get, url);
  }

  createWateringsSchedule(device_id, data) {
    var url = this.host + '/devices/waterings/' + device_id + '/schedules/';
    return this.callApi(this.post, url, {schedule: data});
  }

  updateWateringsSchedule(device_id, schedule_id, data) {
    var url = this.host + '/devices/waterings/' + device_id + '/schedules/' + schedule_id;
    return this.callApi(this.put, url, {schedule: data});
  }

  removeWateringsSchedule(device_id, schedule_id) {
    var url = this.host + '/devices/waterings/' + device_id + '/schedules/' + schedule_id;
    return this.callApi(this.delete, url);
  }

  ///// lowlevel functions
  callApi(api, url, query={}) {
    return api(url, query)
      .then((data) => {
        this.logger.log('url', url);
        this.logger.log('query', query);
        this.logger.log('response', data);
        return(data.body);

      }).catch((err) => {
        this.logger.error('url', url);
        this.logger.error('query', query);
        this.logger.error('error', err);
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
