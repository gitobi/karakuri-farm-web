import {DevicesSystemLog} from '../constants/devicesSystemLog';
import Bastet from '../js/Bastet'

export function loadDevicesSystemLogs(deviceId) {
  return function(dispatch) {
    dispatch({ type: DevicesSystemLog.LOAD_REQUEST });
    let bastet = new Bastet();
    return bastet.getDevicesSystemLogs(deviceId).then(
      result => {
        dispatch({ type: DevicesSystemLog.LOAD_SUCCESS, list: result.data });
      },
      error => {
        dispatch({ type: DevicesSystemLog.LOAD_FAILURE, list: error })
      }
    );
  }
};
