import {Suzu} from '../constants/suzu';
import Bastet from '../js/Bastet'
import * as ActionUtils from './actionUtils'

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


export function save(deviceId, changed) {
  return function(dispatch) {

    if (!ActionUtils.checkValid(changed)) {
      // TODO エラーが存在するためBastetへの更新を行わない場合の画面表示メッセージ
      console.log('check error', changed);
      return false;
    }

    dispatch({ type: Suzu.SAVE_DEVICE_MONITOR_REQUEST });
    let bastet = new Bastet();

    let promises = [];
    Object.keys(changed).forEach((key) => {
      let params = changed[key];
      params.id = key;

      switch (params._state) {
        case 'create':
          // 新規
          promises.push(ActionUtils.ApiRequest(
            dispatch,
            Suzu.POST_DEVICE_MONITOR_REQUEST,
            Suzu.POST_DEVICE_MONITOR_SUCCESS,
            Suzu.POST_DEVICE_MONITOR_FAILURE,
            bastet,
            bastet.createDevicesDeviceMonitor,
            [deviceId, params],
            key
          ));
          break;

        default:
          // 更新
          promises.push(ActionUtils.ApiRequest(
            dispatch,
            Suzu.PUT_DEVICE_MONITOR_REQUEST,
            Suzu.PUT_DEVICE_MONITOR_SUCCESS,
            Suzu.PUT_DEVICE_MONITOR_FAILURE,
            bastet,
            bastet.updateDevicesDeviceMonitor,
            [deviceId, key, params],
            key
          ));
          break
      }
    });

    return Promise.all(promises).then(
      result => dispatch({ type: Suzu.SAVE_DEVICE_MONITOR_SUCCESS }),
      error => dispatch({ type: Suzu.SAVE_DEVICE_MONITOR_FAILURE, error: error })
    );
  }
};

export function update(id, column, value, error) {
  return {
    type: Suzu.UPDATE_DEVICE_MONITOR,
    id: id,
    column: column,
    value: value,
    error: error,
  };
};
