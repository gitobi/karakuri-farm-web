import {DevicesAlert} from '../constants/devicesAlert';
import Bastet from '../js/Bastet'

export function loadDevicesAlerts(deviceId) {

  return function(dispatch) {
    dispatch({ type: DevicesAlert.LOAD_REQUEST });

    let bastet = new Bastet();
    return bastet.getDevicesAlerts(deviceId).then(
      result => {
        dispatch({ type: DevicesAlert.LOAD_SUCCESS, list: result.data });
      },
      error => {
        // DEBUG エラー時にダミーデータを使用する場合
        // これは将来的に削除されるか、もっとスマートな形で実装される
        dispatch({ type: DevicesAlert.LOAD_SUCCESS, list: _load()})
        // dispatch({ type: DevicesAlert.LOAD_FAILURE, list: error })
      }
    );
  }
};

/**
 * FOR DEBUG
 */
const _load = () => {
  return [
    { id: 1, summary: "summary 1",},
    { id: 2, summary: "summary 2",},
  ];
}

