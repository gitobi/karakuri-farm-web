import {DevicesPyranometer} from '../constants/devicesPyranometer';
import Bastet from '../js/Bastet'

export function loadDevicesPyranometerWorkingDays(deviceId) {
  return function(dispatch) {
    dispatch({ type: DevicesPyranometer.LOAD_WORKING_DAYS_REQUEST });
    let params = {date_trunc: "day"}
    let bastet = new Bastet();
    return bastet.getPyranometersStats(deviceId, params).then(
      result => dispatch({ type: DevicesPyranometer.LOAD_WORKING_DAYS_SUCCESS, data: result.data }),
      error => {
        dispatch({ type: DevicesPyranometer.LOAD_WORKING_DAYS_FAILURE, error: error })
      }
    );
  }
};

export function loadDevicesPyranometerSensingRecords(deviceId) {
  return function(dispatch) {
    dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_REQUEST });
    let bastet = new Bastet();
    return bastet.getPyranometersSensingRecords(deviceId).then(
      result => dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_SUCCESS, sensingRecords: result.data }),
      error => {
        dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_FAILURE, error: error })
      }
    );
  }
};

export function loadDevicesPyranometerSensingRecordsPage(deviceId, params) {
  return function(dispatch) {
    dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_REQUEST });
    let bastet = new Bastet();
    return bastet.getPyranometersSensingRecordsPage(deviceId, params).then(
      result => {
        console.log("action loaded:", result);
        dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_SUCCESS, sensingRecords: result.data })
      },
      error => {
        dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_FAILURE, error: error })
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
        console.log("action loaded:", result);
        dispatch({ type: DevicesPyranometer.LOAD_STATS_SUCCESS, stats: result.data, unit: unit })
      },
      error => {
        dispatch({ type: DevicesPyranometer.LOAD_STATS_FAILURE, error: error })
      }
    );
  }
};
