import { List, Map, fromJS } from 'immutable';
import { DevicesSystemLog } from '../constants/devicesSystemLog';
import GtbUtils from '../js/GtbUtils'
// import Logger from '../js/Logger'

// const _logger = new Logger({prefix: 'devicesSystemLog'});

const initialDevicesSystemLog = Map({
  'list': List([]),
  'progress': false,
});

const deviceSystemLog = (state = initialDevicesSystemLog, action) => {
  // _logger.info('state :', state.toJS());
  // _logger.info('action :', action);

  switch (action.type) {
    case DevicesSystemLog.LOAD_REQUEST:
      // アラートの取得開始
      return state.set('progress', true);

    case DevicesSystemLog.LOAD_SUCCESS:
      // アラート情報の取得完了

      let system_logs = action.list.map((value) => {
          return {
            // key: value["key"],
            id: value["id"],
            priority: value["priority"],
            raised_at: GtbUtils.dateString(new Date(value["updated_at"])),
            application: value["application"],
            process: value["process"],
            thread: value["thread"],
            summary: value["summary"],
            detail: value["detail"],
            trace: value["trace"],
          };
        });

      return state.withMutations(map => { map
        .set('list', fromJS(system_logs))
        .set('progress', false)
        ;
      });

    case DevicesSystemLog.LOAD_FAILURE:
      // アラート情報の取得失敗
      return state.set('progress', false);

    default:
      return state;
  }
}

export default deviceSystemLog;
