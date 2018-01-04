import {DevicesPyranometer} from '../constants/devicesPyranometer';
import Bastet from '../js/Bastet'

export function loadPyranometerInformations(device) {
  return function(dispatch) {
    dispatch({ type: DevicesPyranometer.SELECT, device: device });
    dispatch(loadDevicesPyranometerSensingRecords(device.id));
  }
};

export function loadDevicesPyranometerSensingRecords(deviceId) {
  return function(dispatch) {
    dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_REQUEST });
    let bastet = new Bastet();
    return bastet.getPyranometersSensingRecords(deviceId).then(
      result => dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_SUCCESS, sensingRecords: result.data }),
      error => {
        dispatch({ type: DevicesPyranometer.LOAD_SCHEDULES_FAILURE, schedules: error })
      }
    );
  }
};

