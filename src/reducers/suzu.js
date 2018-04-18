import { Map, fromJS } from 'immutable';
import { Suzu } from '../constants/suzu';
import GtbUtils from '../js/GtbUtils'
// import Logger from '../js/Logger'

// const _logger = new Logger({prefix: 'suzu'});

const initialSuzu = Map({
  'deviceMonitor': Map({}),
  'changed': Map({}),
  'progress': false,
});

const suzu = (state = initialSuzu, action) => {
  // _logger.info('state :', state.toJS());
  // _logger.info('action :', action);

  switch (action.type) {
    case Suzu.LOAD_REQUEST:
      return state.set('progress', true);

    case Suzu.LOAD_SUCCESS:
      let deviceMonitors = action.list.map((value) => {
          return {
            id: value["id"],
            inserted_at: GtbUtils.dateString(new Date(value["inserted_at"])),
            updated_at: GtbUtils.dateString(new Date(value["updated_at"])),
            enable: value["enable"],
            monitoring_range: value["monitoring_range"],
            last_result: value["last_result"],
          };
        });
      let deviceMonitor = deviceMonitors[0]
        ? deviceMonitors[0]
        : {
          id: GtbUtils.getTmpId([]),
          enable: false,
          monitoring_range: null,
          last_result: null,
        };

      return state.withMutations(map => { map
        .set('deviceMonitor', fromJS(deviceMonitor))
        .set('progress', false)
        ;
      });

    case Suzu.LOAD_FAILURE:
      return state.set('progress', false);

    case Suzu.SAVE_DEVICE_MONITOR_REQUEST:
      return state.set('progress', true);

    case Suzu.SAVE_DEVICE_MONITOR_SUCCESS:
      return state.set('progress', false);

    case Suzu.SAVE_DEVICE_MONITOR_FAILURE:
      console.log(action.error);
      return state.set('progress', false);

    case Suzu.POST_DEVICE_MONITOR_REQUEST:
      return state;

    case Suzu.POST_DEVICE_MONITOR_SUCCESS:
      // postした結果払い出されたIDを設定する
      // 変更が完了した情報を削除する
      return state.withMutations(map => { map
        .setIn(['deviceMonitor', 'id'], action.result.data.id)
        .deleteIn(['changed', action.resourceId])
        ;
      });

    case Suzu.POST_DEVICE_MONITOR_FAILURE:
      return state;

    case Suzu.PUT_DEVICE_MONITOR_REQUEST:
      return state;

    case Suzu.PUT_DEVICE_MONITOR_SUCCESS:
      // 変更が完了した情報を削除する
      return state.deleteIn(['changed', action.resourceId]);

    case Suzu.PUT_DEVICE_MONITOR_FAILURE:
      // スケジュール情報のput失敗
      return state;

    case Suzu.UPDATE_DEVICE_MONITOR:
      let _state = GtbUtils.isTmpId(state.getIn(['deviceMonitor', "id"])) ? 'create' : 'update';
      return state.withMutations(map => { map
        .setIn(['deviceMonitor', action.column], action.value)
        .setIn(['changed', action.id, action.column], action.value)
        .setIn(['changed', action.id, "_state"], _state)
        .setIn(['deviceMonitor', '_errors', action.column], action.error)
        .setIn(['changed', action.id, '_errors', action.column], action.error)
        ;
      });

    default:
      return state;
  }
}

export default suzu;
