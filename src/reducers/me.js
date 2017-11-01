import { Me } from '../constants/me';

const initialMe = { 'name': 'Ninja', 'username': 'ninja' };

const me = (state = initialMe, action) => {
  switch (action.type) {
    case Me.SIGN_UP_REQUEST:
      return state;
    case Me.SIGN_UP_FAILURE:
      return Object.assign(state, { error: action.error });
    case Me.SIGN_UP_SUCCESS:
      return Object.assign(state, { username: action.username });
    case Me.RENAME:
      return Object.assign(state, { name: action.name });
    default:
      return state;
  }
}

export default me;
