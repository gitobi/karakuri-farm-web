import { List, Map, fromJS } from 'immutable';
import { MachinesRadiationalWatering } from '../constants/machinesRadiationalWatering';
import GtbUtils from '../js/GtbUtils'

import Logger from '../js/Logger'
const _logger = new Logger({prefix: 'machinesRadiationalsWatering'});

const initialMachinesRadiationalWatering = Map({
  'schedules': List([]),
  'changed': Map({}),
  'progress': false,
});

const machinesRadiationalWatering = (state = initialMachinesRadiationalWatering, action) => {
  // _logger.info('state :', state.toJS());
  // _logger.info('action :', action);

  switch (action.type) {
    case MachinesRadiationalWatering.LOAD_SCHEDULES_REQUEST:
      // スケジュール情報の取得開始
      return state.set('progress', true);

    case MachinesRadiationalWatering.LOAD_SCHEDULES_SUCCESS:
      // スケジュール情報の取得完了
      _logger.info("success:", action);
      return state.withMutations(map => { map
        .set('schedules', fromJS(action.list).sort((a, b) => {
          if( a < b ) return -1;
          if( a > b ) return 1;
          return 0;
        }))
        .set('changed', Map({}))
        .set('progress', false)
        ;
      });

    case MachinesRadiationalWatering.LOAD_SCHEDULES_FAILURE:
      // スケジュール情報の取得失敗
      return state.set('progress', false);

    case MachinesRadiationalWatering.SAVE_SCHEDULES_REQUEST:
      // スケジュール情報の保存開始
      return state.set('progress', true);

    case MachinesRadiationalWatering.SAVE_SCHEDULES_SUCCESS:
      // スケジュール情報の保存完了
      return state.set('progress', false);

    case MachinesRadiationalWatering.SAVE_SCHEDULES_FAILURE:
      // スケジュール情報の保存失敗
      console.log(action.error);
      return state.set('progress', false);

    case MachinesRadiationalWatering.POST_SCHEDULES_REQUEST:
      // スケジュール情報のpost開始
      return state;

    case MachinesRadiationalWatering.POST_SCHEDULES_SUCCESS:
      // スケジュール情報のpost完了

      // postした結果払い出されたIDを設定する
      // 変更が完了した情報を削除する
      var postedIndex = GtbUtils.findIndex(state.get('schedules').toJS(), 'id', action.params.id);
      return state.withMutations(map => { map
        .setIn(['schedules', postedIndex, 'id'], action.result.id)
        .deleteIn(['changed', action.params.id])
        ;
      });

    case MachinesRadiationalWatering.POST_SCHEDULES_FAILURE:
      // スケジュール情報のpost失敗
      return state;

    case MachinesRadiationalWatering.PUT_SCHEDULES_REQUEST:
      // スケジュール情報のput開始
      return state;

    case MachinesRadiationalWatering.PUT_SCHEDULES_SUCCESS:
      // スケジュール情報のput完了
      // 変更が完了した情報を削除する
      return state.deleteIn(['changed', action.params.id]);

    case MachinesRadiationalWatering.PUT_SCHEDULES_FAILURE:
      // スケジュール情報のput失敗
      return state;

    case MachinesRadiationalWatering.DELETE_SCHEDULES_REQUEST:
      // スケジュール情報のdelete開始
      return state;

    case MachinesRadiationalWatering.DELETE_SCHEDULES_SUCCESS:
      // スケジュール情報のdelete完了
      // 変更が完了した情報を削除する
      return state.deleteIn(['changed', action.params.id]);

    case MachinesRadiationalWatering.DELETE_SCHEDULES_FAILURE:
      // スケジュール情報のdelete失敗
      return state;

    case MachinesRadiationalWatering.ADD_SCHEDULE:
      // スケジュールを追加

      // 一時IDを発行する
      var tmpId = GtbUtils.getTmpId(
        state.get('schedules').toJS().map((row) => {
          return row.id
        }));

      // 行を作成して追加
      var row = Map({
        id: tmpId,
        radiational_watering_id: action.machinesId,
        _state: 'create',
      })

      return state.withMutations(map => { map
        .update('schedules', schedules => {
          return schedules.push(row);
        }).update('changed', changed => {
          return changed.set(row.get('id'), row);
        });
      });

    case MachinesRadiationalWatering.REMOVE_SCHEDULE:
      // スケジュールを削除
      var removeIndex = GtbUtils.findIndex(state.get('schedules').toJS(), 'id', action.id);
      return state.withMutations(map => {
        if (map.hasIn(['changed', action.id])) {
          // 未保存のデータの場合は削除
          map.deleteIn(['changed', action.id]);
        } else {
          // 保存済のデータの場合は追加
          map.setIn(['changed', action.id], map.getIn(['schedules', removeIndex]))
            .setIn(['changed', action.id, '_state'], 'delete')
        }
        map.deleteIn(['schedules', removeIndex]);
      });

    case MachinesRadiationalWatering.UPDATE_SCHEDULE:
      // スケジュールを変更
      var updateIndex = GtbUtils.findIndex(state.get('schedules').toJS(), 'id', action.id);

      // 変更点のみ保持するタイプ
      return state.withMutations(map => { map
        .setIn(['schedules', updateIndex, action.column], action.value)
        .setIn(['changed', action.id, action.column], action.value)
        .setIn(['schedules', updateIndex, '_errors', action.column], action.error)
        .setIn(['changed', action.id, '_errors', action.column], action.error)
        ;
      });


    default:
      return state;
  }
}

export default machinesRadiationalWatering;
