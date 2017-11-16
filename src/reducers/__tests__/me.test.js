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
        'name': 'Ninja',
        'username': 'ninja'
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
        'name': 'Ninja',
        'username': 'ninja'
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
        'name': 'Ninja',
        'username': 'ninja',
        'error': 'Error object'
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
        'name': 'Ninja',
        'username': 'CreatedUsername'
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
        'name': 'Renamed Name',
        'username': 'ninja'
      })
    );
  });
});
