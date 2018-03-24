import { Map, fromJS } from 'immutable';
import { Account } from '../constants/account';
import GtbUtils from '../js/GtbUtils'

// import Logger from '../js/Logger'
// const _logger = new Logger({prefix: 'account'});

const initialAccount = Map({
  'user': Map({}),
  'progress': false,
});

const createUserObject = (object) => {
  return {
    id: object["id"],
    name: object["name"],
    organization_id: object["organization_id"],
    jwt_username: object["jwt_username"],
    jwt_id: object["jwt_id"],
    jwt_email: object["jwt_email"],
    inserted_at: GtbUtils.dateString(new Date(object["inserted_at"])),
    updated_at: GtbUtils.dateString(new Date(object["updated_at"])),
  };
}

const account = (state = initialAccount, action) => {
  // _logger.info('state :', state.toJS());
  // _logger.info('action :', action);

  switch (action.type) {
    case Account.LOAD_REQUEST:
      // アカウント情報の取得開始
      return state.set('progress', true);

    case Account.LOAD_SUCCESS:
      // アカウント情報の取得完了
      let user = createUserObject(action.account["user"]);

      return state.withMutations(map => { map
        .set('user', fromJS(user))
        .set('progress', false)
        ;
      });

    case Account.LOAD_FAILURE:
      // アカウント情報の取得失敗
      return state.set('progress', false);

    default:
      return state;
  }
}

export default account;
