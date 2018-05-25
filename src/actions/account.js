import {Account} from '../constants/account';
import Bastet from '../js/Bastet'
import * as ActionUtils from './actionUtils'

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

export function update(id, column, value, error) {
  // console.log('update debug:', id, column, value, error);
  return {
    type: Account.UPDATE,
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

    dispatch({ type: Account.SAVE_REQUEST });
    let bastet = new Bastet();

    let promises = [];
    Object.keys(changed).forEach((key) => {
      let params = changed[key];

      switch (params._type) {
        case 'user':
          promises.push(ActionUtils.ApiRequest(
            dispatch,
            Account.PUT_REQUEST,
            Account.PUT_SUCCESS,
            Account.PUT_FAILURE,
            bastet,
            bastet.updateAccountsUser,
            [key, params],
            key
          ));
          break;

        default:
          switch (params._state) {
            case 'create':
              // 新規
              promises.push(ActionUtils.ApiRequest(
                dispatch,
                Account.POST_REQUEST,
                Account.POST_SUCCESS,
                Account.POST_FAILURE,
                bastet,
                bastet.createAccountsOrganization,
                [params],
                key
              ));
              break;

            default:
              // 更新
              promises.push(ActionUtils.ApiRequest(
                dispatch,
                Account.PUT_REQUEST,
                Account.PUT_SUCCESS,
                Account.PUT_FAILURE,
                bastet,
                bastet.updateAccountsOrganization,
                [key, params],
                key
              ));
              break;
          }
      }
    });

    return Promise.all(promises).then(
      result => dispatch({ type: Account.SAVE_SUCCESS, results: result }),
      error => dispatch({ type: Account.SAVE_FAILURE, error: error })
    );
  }
};

export function joinOrganization(organizationName) {
  console.log('joinOrganization:', organizationName);
  return function(dispatch) {
    let bastet = new Bastet();
    dispatch({ type: Account.JOIN_REQUEST });

    let params = ActionUtils.addFilteredQuery({}, "name", "eq", organizationName);
    return bastet.getAccountsOrganizationBy(params)
      .then(result => {
        console.log('getAccountsOrganizationBy:', result);
        if (0 === result.data.length) {
          // 存在しない場合は作成
          return bastet.createAccountsOrganization({"name": organizationName});
        } else {
          // 存在する場合は次のフェーズへ
          return {data: result.data[0]};
        }
      })
      .then(result => {
        console.log('created Organization:', result);
        return bastet.createAccountsOrganizationsMember(result.data["id"], {});
        // TODO すでにメンバーになっている場合エラーとなる
      })
      .then(result => {
        dispatch({ type: Account.JOIN_SUCCESS, account: result.data });
      })
      .catch(error => {
        dispatch({ type: Account.JOIN_FAILURE, error: error });

      });
  }
};
