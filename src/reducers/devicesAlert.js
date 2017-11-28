import { List, Map, fromJS } from 'immutable';
import { DevicesAlert } from '../constants/devicesAlert';
import GtbUtils from '../js/GtbUtils'
import Logger from '../js/Logger'

const _logger = new Logger({prefix: 'devicesAlert'});

const initialDevicesAlert = Map({
  'list': List([]),
  'progress': false,
});

const deviceAlert = (state = initialDevicesAlert, action) => {
  _logger.info('state :', state.toJS());
  _logger.info('action :', action);

  switch (action.type) {
    case DevicesAlert.LOAD_REQUEST:
      // アラートの取得開始
      return state.set('progress', true);

    case DevicesAlert.LOAD_SUCCESS:
      // アラート情報の取得完了

      let alert = action.list.map((value) => {
          return {
            // key: value["key"],
            id: value["id"],
            updated_at: GtbUtils.dateString(new Date(value["updated_at"])),
            summary: value["summary"],
            detail: value["detail"],
            trace: value["trace"],
          };
        });

      return state.withMutations(map => { map
        .set('list', fromJS(alert))
        .set('progress', false)
        ;
      });

    case DevicesAlert.LOAD_FAILURE:
      // アラート情報の取得失敗
      return state.set('progress', false);

    default:
      return state;
  }
}

export default deviceAlert;
