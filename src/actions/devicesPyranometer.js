import {DevicesPyranometer} from '../constants/devicesPyranometer';
import Bastet from '../js/Bastet'

export function loadDevicesPyranometerSensingRecords(deviceId) {
  return function(dispatch) {
    dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_REQUEST });
    let bastet = new Bastet();
    return bastet.getPyranometersSensingRecords(deviceId).then(
      result => dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_SUCCESS, sensingRecords: result.data }),
      error => {
        dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_FAILURE, schedules: error })
      }
    );
  }
};

export function loadDevicesPyranometerSensingRecordsPage(deviceId, params) {
  return function(dispatch) {
    dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_REQUEST });
    let bastet = new Bastet();
    return bastet.getPyranometersSensingRecordsPage(deviceId, params).then(
      result => dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_SUCCESS, sensingRecords: result.data }),
      error => {
        dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_FAILURE, schedules: error })
      }
    );
  }
};

