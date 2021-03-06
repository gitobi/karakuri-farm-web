import Logger from './Logger'
import request from 'superagent'
import moment from 'moment';
import { userPool } from '../js/AuthUserPool';

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
      this.getDevicesSoilmoistures(),
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

  getDevicesSoilmoistures(id=null) {
    var url = this.host + '/devices/soilmoistures/';
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
    var url = this.host + '/machines/radiational_waterings/';
    return this.callApi(this.get, url)
      .then((data) => {
        return data.data.map((value, index, array) => {
          value["_type"] = value.machine_type;
          return value;
        });
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

  updateMachinesRadiationalWatering(id, data) {
    var url = this.host + '/machines/radiational_waterings/' + id;
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

  getRadiationalWateringsFormulae(machineId) {
    var url = this.host + '/machines/radiational_waterings/' + machineId + '/formulae/';
    return this.callApi(this.get, url);
  }

  createRadiationalWateringsFormula(machineId, data) {
    var url = this.host + '/machines/radiational_waterings/' + machineId + '/formulae/';
    return this.callApi(this.post, url, {formula: data});
  }

  updateRadiationalWateringsFormula(machineId, data) {
    this.logger.log(machineId, data);
    var url = this.host + '/machines/radiational_waterings/' + machineId + '/formulae/' + data.id;
    return this.callApi(this.put, url, {formula: data});
  }

  deleteRadiationalWateringsFormula(machineId, data) {
    var url = this.host + '/machines/radiational_waterings/' + machineId + '/formulae/' + data.id;
    return this.callApi(this.delete, url);
  }

  /////

  getWateringsOperationalRecords(id, params={}) {
    var url = this.host + '/devices/waterings/' + id + '/operational_records';
    params.limit = 10080
    let hash = this.nestedObjectToQueryObject(params);
    // this.logger.log('getWateringsOperationalRecords:', params, '=>', hash);
    return this.callApi(this.get, url, hash);
  }

  getWateringsStats(id, params={}) {
    var url = this.host + '/devices/waterings/' + id + '/stats';
    let hash = this.nestedObjectToQueryObject(params);
    // this.logger.log('getWateringsStats:', params, '=>', hash);
    return this.callApi(this.get, url, hash);
  }

  ///

  getPyranometersSensingRecords(id, params={}) {
    var url = this.host + '/devices/pyranometers/' + id + '/sensing_records';
    params.limit = 10080;
    let hash = this.nestedObjectToQueryObject(params);
    // this.logger.log('getPyranometersSensingRecords:', params, '=>', hash);
    return this.callApi(this.get, url, hash);
  }

  getPyranometersStats(id, params={}) {
    var url = this.host + '/devices/pyranometers/' + id + '/stats';
    let hash = this.nestedObjectToQueryObject(params);
    // this.logger.log('getPyranometersStats:', params, '=>', hash);
    return this.callApi(this.get, url, hash);
  }

  ///

  getSoilmoisturesSensingRecords(id, params={}) {
    var url = this.host + '/devices/soilmoistures/' + id + '/sensing_records';
    params.limit = 10080;
    let hash = this.nestedObjectToQueryObject(params);
    // this.logger.log('getSoilmoisturesSensingRecords:', params, '=>', hash);
    return this.callApi(this.get, url, hash);
  }

  getSoilmoisturesStats(id, params={}) {
    var url = this.host + '/devices/soilmoistures/' + id + '/stats';
    let hash = this.nestedObjectToQueryObject(params);
    // this.logger.log('getSoilmoisturesStats:', params, '=>', hash);
    return this.callApi(this.get, url, hash);
  }

  /////

  getDevicesSystemLogs(deviceId, params={}) {
    var url = this.host + '/devices/' + deviceId + '/system_logs';
    params.sorted = {
      "0": {"id": "raised_at", "desc": true},
    };
    params.limit = 10080;
    let hash = this.nestedObjectToQueryObject(params);
    // this.logger.log('getDevicesSystemLogs:', params, '=>', hash);
    return this.callApi(this.get, url, hash);
  }

  /////

  getAccount() {
    var url = this.host + '/account';
    return this.callApi(this.get, url);
  }

  getAccountsOrganizationBy(params) {
    var url = this.host + '/accounts/organizations/';
    params.limit = 1
    let hash = this.nestedObjectToQueryObject(params);
    return this.callApi(this.get, url, hash);
  }

  createAccountsOrganization(data) {
    var url = this.host + '/accounts/organizations/';
    return this.callApi(this.post, url, {organization: data});
  }

  updateAccountsOrganization(id, data) {
    this.logger.log(id, data);
    var url = this.host + '/accounts/organizations/' + id;
    return this.callApi(this.put, url, {organization: data});
  }

  updateAccountsUser(id, data) {
    this.logger.log(id, data);
    var url = this.host + '/accounts/users/' + id;
    return this.callApi(this.put, url, {user: data});
  }

  createAccountsOrganizationsMember(id, data) {
    this.logger.log(id, data);
    var url = this.host + '/accounts/organizations/' + id + '/members/';
    return this.callApi(this.post, url, {member: data});
  }

  /////

  activateDevice(activationCode) {
    var url = this.host + '/activation/activate/';
    return this.callApi(this.put, url, {type: 'device', value: activationCode});
  }

  /////

  getDevicesDeviceMonitor(deviceId) {
    var url = this.host + '/devices/' + deviceId + '/monitors';
    return this.callApi(this.get, url);
  }

  createDevicesDeviceMonitor(deviceId, data) {
    var url = this.host + '/devices/' + deviceId +  '/monitors';
    return this.callApi(this.post, url, {device_monitor: data});
  }

  updateDevicesDeviceMonitor(deviceId, id, data) {
    this.logger.log(id, data);
    var url = this.host + '/devices/' + deviceId + '/monitors/' + id;
    return this.callApi(this.put, url, {device_monitor: data});
  }

  ///// lowlevel functions
  callApi(api, url, query={}, opt={}) {
    return new Promise((resolve, reject) => {
      // ログイン情報取得
      userPool.getCurrentUser().getSession((err, signInUserSession) => {
        // this.logger.log('getSession', err, signInUserSession);
        resolve(signInUserSession);
      });
      // FIXME ログイン情報取得失敗時の処理

    }).then((result) => {
      // Bastetへリクエスト
      let req = api(url, query);
      return this.methodsCommon(req, result.idToken.jwtToken, opt)
        .then((response) => {
          // this.logger.log('request', url, query);
          // this.logger.log('response', response);
          return(response.body);

        }).catch((err) => {
          if (err.status !== 404) {
            this.logger.error('request', url, query);
            this.logger.error('status', err.status);
            if (err.response) {
              this.logger.error('response', err.response.statusText, err.response.body);
            }
          }
          throw new Error(err);
        });

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
  get(url, query) {
    return request.get(url).query(query);
  }

  post(url, query) {
    return request.post(url).send(query);
  }

  put(url, query) {
    return request.put(url).send(query);
  }

  delete(url, query) {
    return request.delete(url).send(query);
  }

  methodsCommon(req, idToken, opt) {
    let contentType = opt.contentType || 'application/json';
    return new Promise((resolve, reject) => {
      req
        .set('Content-Type', contentType)
        .set('Authorization', idToken)
        .then((data) => {
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
  }

  // superagentがネストパラメータに対応していないため、整形する
  // [ex]
  //  [params]
  //    {
  //      a: '1',
  //      b: {
  //        innerA: '2',
  //        innerB: '3'
  //      }
  //    }
  //
  //  [return]
  //    {
  //      a: '1',
  //      'b[innerA]': '2',
  //      'b[innerB]': '3',
  //    }
  nestedObjectToQueryObject(params) {
    let hash = {};
    Object.keys(params).forEach((key) =>  {
      let value = params[key];
      let returndHash = this.toQueryStringHash(key, value);
      Object.keys(returndHash).forEach((returndHashKey) =>  {
        hash[returndHashKey] = returndHash[returndHashKey];
      });
    });
    return hash;
  }

  // ネストされたパラメータを再帰的に展開していく
  // [ex]
  //  オブジェクトの場合
  //  [params]
  //    key = 'a[1]'
  //    value = {id: A, value: B}
  //  [return]
  //    {'a[1][id]': A, 'a[1][value]': B}
  //
  //  Arrayの場合
  //  [params]
  //    key = 'a[1]'
  //    value = [A, B]
  //  [return]
  //    {'a[1][0]': A, 'a[1][1]': B}
  toQueryStringHash(key, value) {
    let hash = {};
    if (moment.isMoment(value)) {
      hash[key] = value.utc().format();

    } else if (this.isArray(value)) {
      value.forEach((element, index) => {
        Object.assign(hash, this.toQueryStringHash(`${key}[${index}]`, element));
      });

    } else if (this.isObject(value)) {
      Object.keys(value).forEach((valueKey) =>  {
        let element = value[valueKey];
        Object.assign(hash, this.toQueryStringHash(`${key}[${valueKey}]`, element));
      });

    } else {
      hash[key] = value;
    }
    // this.logger.log('tqsh return:', key, value, '=>', hash);
    return hash;
  }
  isArray(o) {
    return (o instanceof Array);
  }
  isObject(o) {
    return (o instanceof Object && !(o instanceof Array)) ? true : false;
  }
}
