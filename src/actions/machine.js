import {Machine} from '../constants/machine';
import Bastet from '../js/Bastet'
import * as ActionUtils from './actionUtils'

/**
 * deviceをloadする
 * @param  {Object} args [description]
 * @return {[type]}      [description]
 */
export function loadMachines(args = {}) {
  // TODO argsにはOrganizationIdなどを予定
  return function(dispatch) {
    dispatch({ type: Machine.LOAD_REQUEST });
    let bastet = new Bastet();
    return bastet.getMachines().then(
      result => {
        dispatch({ type: Machine.LOAD_SUCCESS, list: result });
      },
      error => {
        dispatch({ type: Machine.LOAD_FAILURE, list: error });
      }
    );
  }
};

export function update(id, column, value, error) {
  console.log('update debug:', id, column, value, error);
  return {
    type: Machine.UPDATE,
    id: id,
    column: column,
    value: value,
    error: error,
  };
};

export function save(changed) {
  // TODO machineに対するupdate

  return function(dispatch) {

    if (!ActionUtils.checkValid(changed)) {
      // TODO エラーが存在するためBastetへの更新を行わない場合の画面表示メッセージ
      console.log('check error', changed);
      return false;
    }

    dispatch({ type: Machine.SAVE_REQUEST });
    let bastet = new Bastet();

    let promises = [];
    Object.keys(changed).forEach((key) => {
      let params = changed[key];
      params.id = key;

      // 更新
      promises.push(ActionUtils.ApiRequest(
        dispatch,
        Machine.PUT_REQUEST,
        Machine.PUT_SUCCESS,
        Machine.PUT_FAILURE,
        bastet,
        bastet.updateMachine,
        [params.id, params],
        params.id
      ));
    });

    return Promise.all(promises).then(
      result => dispatch({ type: Machine.SAVE_SUCCESS }),
      error => dispatch({ type: Machine.SAVE_FAILURE, error: error })
    );
  }
};
