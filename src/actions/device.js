import {Device} from '../constants/device';
import Bastet from '../js/Bastet'
import * as ActionUtils from './actionUtils'

/**
 * deviceをloadする
 * @param  {Object} args [description]
 * @return {[type]}      [description]
 */
export function loadDevices(args = {}) {
  // TODO argsにはOrganizationIdなどを予定
  return function(dispatch) {
    dispatch({ type: Device.LOAD_REQUEST });
    let bastet = new Bastet();
    return bastet.getDevices().then(
      result => {
        dispatch({ type: Device.LOAD_SUCCESS, list: result });
      },
      error => {
        dispatch({ type: Device.LOAD_FAILURE, list: error });
      }
    );
  }
};

export function update(id, column, value, error) {
  return {
    type: Device.UPDATE,
    id: id,
    column: column,
    value: value,
    error: error,
  };
};

export function save(changed) {
  return function(dispatch) {

    if (!ActionUtils.checkValid(changed)) {
      // TODO エラーが存在するためBastetへの更新を行わない場合の画面表示メッセージ
      console.log('check error', changed);
      return false;
    }

    dispatch({ type: Device.SAVE_REQUEST });
    let bastet = new Bastet();

    let promises = [];
    Object.keys(changed).forEach((key) => {
      let params = changed[key];
      params.id = key;

      // 更新
      promises.push(ActionUtils.ApiRequest(
        dispatch,
        Device.PUT_REQUEST,
        Device.PUT_SUCCESS,
        Device.PUT_FAILURE,
        bastet,
        bastet.updateDevice,
        params,
      ));
    });

    return Promise.all(promises).then(
      result => dispatch({ type: Device.SAVE_SUCCESS }),
      error => dispatch({ type: Device.SAVE_FAILURE, error: error })
    );
  }
};
