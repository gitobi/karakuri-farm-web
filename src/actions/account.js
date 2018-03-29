import {Account} from '../constants/account';
import Bastet from '../js/Bastet'

/**
 * accountをloadする
 * @param  {Object} args [description]
 * @return {[type]}      [description]
 */
export function loadAccount(args = {}) {
  return function(dispatch) {
    dispatch({ type: Account.LOAD_REQUEST });
    let bastet = new Bastet();
    return bastet.getAccount().then(
      result => {
        dispatch({ type: Account.LOAD_SUCCESS, account: result.data });
      },
      error => {
        dispatch({ type: Account.LOAD_FAILURE, error: error });
      }
    );
  }
};
