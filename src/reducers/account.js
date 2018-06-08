import { Map, List, fromJS } from 'immutable';
import { Account } from '../constants/account';
import GtbUtils from '../js/GtbUtils'

// import Logger from '../js/Logger'
// const _logger = new Logger({prefix: 'account'});

const initialAccount = Map({
  'user': Map({}),
  'organizations': List([]),
  'changed': Map({}),
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

const createOrganizations = (list) => {
  let organizations = [];
  for (var i in list) {
    let item = list[i];
    organizations.push(createOrganizationObject(item));
  }

  return organizations;
}

const createOrganizationObject = (object) => {
  return {
    id: object["id"],
    name: object["name"],
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
      let organizations = createOrganizations(action.account["organizations"]);

      return state.withMutations(map => { map
        .set('user', fromJS(user))
        .set('organizations', fromJS(organizations))
        .set('changed', Map({}))
        .set('progress', false)
        ;
      });

    case Account.LOAD_FAILURE:
      // アカウント情報の取得失敗
      return state.set('progress', false);

    case Account.UPDATE:
      // 情報を変更

      if (state.getIn(['user', 'id']) === action.id) {
        return state.withMutations(map => { map
          .setIn(['changed', action.id, action.column], action.value)
          .setIn(['changed', action.id, '_errors', action.column], action.error)
          .setIn(['changed', action.id, '_type'], "user")
          .setIn(['user', action.column], action.value)
          ;
        });
      } else {
        return state.withMutations(map => { map
          .setIn(['changed', action.id, action.column], action.value)
          .setIn(['changed', action.id, '_errors', action.column], action.error)
          .setIn(['changed', action.id, '_type'], "organization")
          .setIn(['organization', action.column], action.value)
          ;
          if (map.getIn(['organization', 'id']) === "[新規作成]") {
            map.setIn(['changed', action.id, '_state'], "create")
          }
        });
      }

    case Account.SAVE_REQUEST:
      return state.set('progress', true);

    case Account.SAVE_SUCCESS:
      return state.set('progress', false);

    case Account.SAVE_FAILURE:
      return state.set('progress', false);

    case Account.PUT_REQUEST:
      return state;

    case Account.PUT_SUCCESS:
      return state.deleteIn(['changed', action.resourceId]);

    case Account.PUT_FAILURE:
      return state;

    case Account.POST_REQUEST:
      return state;

    case Account.POST_SUCCESS:
      // postした結果払い出されたIDを設定する
      // 変更が完了した情報を削除する
      let createdOrganization = createOrganizationObject(action.result.data);
      return state.withMutations(map => { map
        .set('organization', fromJS(createdOrganization))
        .deleteIn(['changed', action.resourceId])
        ;
      });

    case Account.POST_FAILURE:
      return state;

    case Account.JOIN_REQUEST:
      return state.set('progress', true);

    case Account.JOIN_SUCCESS:
      return state.set('progress', false);

    case Account.JOIN_FAILURE:
      return state.set('progress', false);

    default:
      return state;
  }
}

export default account;
