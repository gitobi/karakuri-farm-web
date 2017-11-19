import { Map } from 'immutable';
import { Me } from '../constants/me';

const initialState = Map({
  'name': 'Ninja',
  'username': 'ninja'
});

const me = (state = initialState, action) => {
  switch (action.type) {
    case Me.SIGN_UP_REQUEST:
      return state;
    case Me.SIGN_UP_FAILURE:
      return state.set('error', action.error);
    case Me.SIGN_UP_SUCCESS:
      return state.set('username', action.username);
    case Me.CONFIRM_REQUEST:
      return state;
    case Me.CONFIRM_FAILURE:
      return state.set('error', action.error);
    case Me.CONFIRM_SUCCESS:
      return state;
    case Me.RENAME:
      return state.set('name', action.name);
    default:
      return state;
  }
}

export default me;
