import {DevicesPyranometer} from '../constants/devicesPyranometer';
import moment from 'moment';
import Bastet from '../js/Bastet'

export function loadDevicesPyranometerWorkingDays(deviceId) {
  return function(dispatch) {
    dispatch({ type: DevicesPyranometer.LOAD_WORKING_DAYS_REQUEST });
    let params = {date_trunc: "day"}
    let bastet = new Bastet();
    return bastet.getPyranometersStats(deviceId, params).then(
      result => dispatch({ type: DevicesPyranometer.LOAD_WORKING_DAYS_SUCCESS, data: result.data }),
      error => {
        return dispatch({ type: DevicesPyranometer.LOAD_WORKING_DAYS_FAILURE, error: error });
      }
    );
  }
};

export function loadDevicesPyranometerSensingRecords(deviceId, date) {
  return function(dispatch) {
    dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_REQUEST });

    let params = {};
    if (date) {
      let replaced = date.replace(new RegExp("/","g"), "-");
      let min = moment(`${replaced} 00:00:00`);
      let max = moment(`${replaced} 23:59:59`);
      params = {filtered: [{id: "sensed_at", value: {min: min, max: max}}]};
    }

    let bastet = new Bastet();
    return bastet.getPyranometersSensingRecords(deviceId, params).then(
      result => dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_SUCCESS, sensingRecords: result.data }),
      error => {
        return dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_FAILURE, error: error });
      }
    );
  }
};

export function loadDevicesPyranometerStats(deviceId, unit) {
  return function(dispatch) {
    dispatch({ type: DevicesPyranometer.LOAD_STATS_REQUEST });
    let params = {date_trunc: unit}
    let bastet = new Bastet();
    return bastet.getPyranometersStats(deviceId, params).then(
      result => {
        // console.log("action loaded:", result);
        return dispatch({ type: DevicesPyranometer.LOAD_STATS_SUCCESS, stats: result.data, unit: unit })
      },
      error => {
        return dispatch({ type: DevicesPyranometer.LOAD_STATS_FAILURE, error: error });
      }
    );
  }
};
