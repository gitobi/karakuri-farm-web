import {Suzu} from '../constants/suzu';
import Bastet from '../js/Bastet'

export function loadSuzu(deviceId) {
  return function(dispatch) {
    dispatch({ type: Suzu.LOAD_REQUEST });
    let bastet = new Bastet();
    return bastet.getDevicesDeviceMonitor(deviceId).then(
      result => {
        dispatch({ type: Suzu.LOAD_SUCCESS, list: result.data });
      },
      error => {
        dispatch({ type: Suzu.LOAD_FAILURE, list: error })
      }
    );
  }
};
