import { Map } from 'immutable';
import { Me } from '../constants/me';
import { userPool } from '../js/AuthUserPool';

const currentUser = userPool.getCurrentUser();
const initialState = Map({
  'isAuthenticated': null != currentUser,
  'username': (currentUser ? currentUser.username : null),
  'error': null,
});

const me = (state = initialState, action) => {
  switch (action.type) {
    case Me.CONFIRM_REQUEST:
      return state;
    case Me.CONFIRM_FAILURE:
      return state.set('error', action.error);
    case Me.CONFIRM_SUCCESS:
      return state.set('error', null);
    case Me.GET_CURRENT:
      return state
        .set('isAuthenticated', action.isAuthenticated);
    case Me.LOGIN_REQUEST:
      return state
        .set('isAuthenticated', false)
        .set('username', null);
    case Me.LOGIN_FAILURE:
      return state
        .set('isAuthenticated', false)
        .set('error', action.error);
    case Me.LOGIN_SUCCESS:
      return state
        .set('isAuthenticated', true)
        .set('username', action.username)
        .set('error', null);
    case Me.LOGOUT:
      return state
        .set('isAuthenticated', false)
        .set('username', null);
    case Me.RENAME:
      return state.set('name', action.name);
    case Me.SIGN_UP_REQUEST:
      return state;
    case Me.SIGN_UP_FAILURE:
      return state.set('error', action.error);
    case Me.SIGN_UP_SUCCESS:
      return state
        .set('username', action.username)
        .set('error', null);
    default:
      return state;
  }
}

export default me;
