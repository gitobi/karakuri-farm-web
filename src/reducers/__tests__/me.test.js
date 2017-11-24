import { Map } from 'immutable';
import me from '../me';
import { Me } from '../../constants/me';

describe('me reducer', () => {
  it('should return the initial state', () => {
    expect(
      me(
        undefined,
        {}
      )
    ).toEqual(
      Map({
        'isAuthenticated': false,
      })
    );
  });

  it('should handle Me.SIGN_UP_REQUEST', () => {
    expect(
      me(
        undefined,
        {
          type: Me.SIGN_UP_REQUEST
        }
      )
    ).toEqual(
      Map({
        'isAuthenticated': false,
      })
    );
  });

  it('should handle Me.SIGN_UP_FAILURE', () => {
    expect(
      me(
        undefined,
        {
          type: Me.SIGN_UP_FAILURE,
          error: 'Error object'
        }
      )
    ).toEqual(
      Map({
        'isAuthenticated': false,
        'error': 'Error object',
      })
    );
  });

  it('should handle Me.SIGN_UP_SUCCESS', () => {
    expect(
      me(
        undefined,
        {
          type: Me.SIGN_UP_SUCCESS,
          username: 'CreatedUsername'
        }
      )
    ).toEqual(
      Map({
        'isAuthenticated': false,
        'username': 'CreatedUsername',
          error: '',
      })
    );
  });

  it('should handle Me.RENAME', () => {
    expect(
      me(
        undefined,
        {
          type: Me.RENAME,
          name: 'Renamed Name'
        }
      )
    ).toEqual(
      Map({
        'isAuthenticated': false,
        'name': 'Renamed Name',
      })
    );
  });
});
