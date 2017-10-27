import { Me } from '../constants/me';

const initialMe = { 'name': 'Ninja' };

const me = (state = initialMe, action) => {
  switch (action.type) {
    case Me.RENAME:
      return Object.assign(state, { name: action.name });
    default:
      return state;
  }
}

export default me;
