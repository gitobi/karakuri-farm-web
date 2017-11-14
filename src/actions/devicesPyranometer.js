import {DevicesPyranometer} from '../constants/devicesPyranometer';
import Bastet from '../js/Bastet'

export function loadDevicesPyranometers() {
  return function(dispatch) {
    dispatch({ type: DevicesPyranometer.LOAD_REQUEST });

    let bastet = new Bastet();
    return bastet.getDevicesPyranometers().then(
      result => {
        dispatch({ type: DevicesPyranometer.LOAD_SUCCESS, list: result });

        if (0 !== result.length) {
          // データが存在する場合は先頭要素を選択状態とする
          dispatch(selectDevicesPyranometer(result[0].id));
        }
      },
      error => {
        // DEBUG エラー時にダミーデータを使用する場合
        // これは将来的に削除されるか、もっとスマートな形で実装される
        dispatch({ type: DevicesPyranometer.LOAD_SUCCESS, list: _load()})
        // dispatch({ type: DevicesPyranometer.LOAD_FAILURE, list: error })
      }
    );
  }
};

export function selectDevicesPyranometer(deviceId, lastDeviceId) {
  if (deviceId === lastDeviceId) {
    return function(dispatch) {
      dispatch({ type: DevicesPyranometer.SELECT, id: deviceId });
    }

  } else {
    // デバイスIDが変更された場合は実績の再読込も行う
    // TODO このハンドリングは別の場所で行うべきかもしれない
    // TODO 現状、デバイスIDが変更される度にスケジュール情報をBastetから取得することになるが、タンクすべきかもしれない
    return function(dispatch) {
      dispatch({ type: DevicesPyranometer.SELECT, id: deviceId });
      dispatch(loadDevicesPyranometerSensingRecords(deviceId));
    }
  }
};

export function loadDevicesPyranometerSensingRecords(deviceId) {
  return function(dispatch) {
    dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_REQUEST });
    let bastet = new Bastet();
    return bastet.getPyranometersSensingRecords(deviceId).then(
      result => dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_SUCCESS, sensingRecords: result.data }),
      error => {
        // DEBUG エラー時にダミーデータを使用する場合
        // これは将来的に削除されるか、もっとスマートな形で実装される
        dispatch({ type: DevicesPyranometer.LOAD_SENSING_RECORDS_SUCCESS, sensingRecords: _loadSensingRecords()})
        // dispatch({ type: DevicesPyranometer.LOAD_SCHEDULES_FAILURE, schedules: error })
      }
    );
  }
};

/**
 * FOR DEBUG
 */
const _load = () => {
  return [
    { key: "1", id: 1, name: "device 1",},
    { key: "2", id: 2, name: "device 2",},
  ];
}

/**
 * FOR DEBUG
 */
const _loadSensingRecords = (deviceId) => {
  return [
    { id: deviceId + "1", sensed_at: "07:01:00", measurement: "100", },
    { id: deviceId + "2", sensed_at: "08:01:00", measurement: "200", },
  ];
}
