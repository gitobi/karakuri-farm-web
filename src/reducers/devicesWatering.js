import { List, Map, fromJS } from 'immutable';
import { DevicesWatering } from '../constants/devicesWatering';
import GtbUtils from '../js/GtbUtils'
import Logger from '../js/Logger'

const _logger = new Logger({prefix: 'devicesWatering'});

const initialDevicesWatering = Map({
  'list': List([]),
  'schedules': List([]),
  'selectedId': '',
  'changed': Map({}),
  'operationalRecords': List([]),
  'progress': false,
});

const deviceWatering = (state = initialDevicesWatering, action) => {
  _logger.info('state :', state.toJS());
  _logger.info('action :', action);

  switch (action.type) {
    case DevicesWatering.LOAD_REQUEST:
      // デバイス情報の取得開始
      return state.set('progress', true);

    case DevicesWatering.LOAD_SUCCESS:
      // デバイス情報の取得完了
      let list = action.list.map((value) => {
          return {
            key: value["key"],
            id: value["id"],
            name: value["name"],
            active: false,
          };
        });

      return state.withMutations(map => { map
        .set('list', fromJS(list))
        .set('schedules', List([]))
        .set('changed', Map({}))
        .set('progress', false)
        ;
      });

    case DevicesWatering.LOAD_FAILURE:
      // デバイス情報の取得失敗
      return state.set('progress', false);

    case DevicesWatering.SELECT:
      // デバイスの選択

      // 指定された要素を選択状態にする
      // TODO viewのために仕方なく必要な処理であるため、ここでやるべきではないかも

      return state.withMutations(map => { map
        .set('selectedId', action.id)
        .update('list', list => list.map(
          // 選択されたidであればtrue、それ以外はfalseに更新する
          object => object.set('active', object.get('id') === action.id))
        )
      });

    case DevicesWatering.LOAD_SCHEDULES_REQUEST:
      // スケジュール情報の取得開始
      return state.set('progress', true);

    case DevicesWatering.LOAD_SCHEDULES_SUCCESS:
      // スケジュール情報の取得完了
      return state.withMutations(map => { map
        .set('schedules', fromJS(action.schedules))
        .set('changed', Map({}))
        .set('progress', false)
        ;
      });

    case DevicesWatering.LOAD_SCHEDULES_FAILURE:
      // スケジュール情報の取得失敗
      return state.set('progress', false);

    case DevicesWatering.SAVE_SCHEDULES_REQUEST:
      // スケジュール情報の保存開始
      return state.set('progress', true);

    case DevicesWatering.SAVE_SCHEDULES_SUCCESS:
      // スケジュール情報の保存完了
      return state.set('progress', false);

    case DevicesWatering.SAVE_SCHEDULES_FAILURE:
      // スケジュール情報の保存失敗
      console.log(action.error);
      return state.set('progress', false);

    case DevicesWatering.POST_SCHEDULES_REQUEST:
      // スケジュール情報のpost開始
      return state;

    case DevicesWatering.POST_SCHEDULES_SUCCESS:
      // スケジュール情報のpost完了

      // postした結果払い出されたIDを設定する
      // 変更が完了した情報を削除する
      var postedIndex = GtbUtils.findIndex(state.get('schedules').toJS(), 'id', action.params.id);
      return state.withMutations(map => { map
        .setIn(['schedules', postedIndex, 'id'], action.result.id)
        .deleteIn(['changed', action.params.id])
        ;
      });

    case DevicesWatering.POST_SCHEDULES_FAILURE:
      // スケジュール情報のpost失敗
      return state;

    case DevicesWatering.PUT_SCHEDULES_REQUEST:
      // スケジュール情報のput開始
      return state;

    case DevicesWatering.PUT_SCHEDULES_SUCCESS:
      // スケジュール情報のput完了
      // 変更が完了した情報を削除する
      return state.deleteIn(['changed', action.params.id]);

    case DevicesWatering.PUT_SCHEDULES_FAILURE:
      // スケジュール情報のput失敗
      return state;

    case DevicesWatering.DELETE_SCHEDULES_REQUEST:
      // スケジュール情報のdelete開始
      return state;

    case DevicesWatering.DELETE_SCHEDULES_SUCCESS:
      // スケジュール情報のdelete完了
      // 変更が完了した情報を削除する
      return state.deleteIn(['changed', action.params.id]);

    case DevicesWatering.DELETE_SCHEDULES_FAILURE:
      // スケジュール情報のdelete失敗
      return state;

    case DevicesWatering.ADD_SCHEDULE:
      // スケジュールを追加

      // 一時IDを発行する
      var tmpId = GtbUtils.getTmpId(
        state.get('schedules').toJS().map((row) => {
          return row.id
        }));

      // 行を作成して追加
      var row = Map({
        id: tmpId,
        device_id: state.get('selectedId'),
        _state: 'create',
      })

      return state.withMutations(map => { map
        .update('schedules', schedules => {
          return schedules.push(row);
        }).update('changed', changed => {
          return changed.set(row.get('id'), row);
        });
      });

    case DevicesWatering.REMOVE_SCHEDULE:
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

    case DevicesWatering.UPDATE_SCHEDULE:
      // スケジュールを変更
      var updateIndex = GtbUtils.findIndex(state.get('schedules').toJS(), 'id', action.id);

      // 変更点のみ保持するタイプ
      return state.withMutations(map => { map
        .setIn(['schedules', updateIndex, action.column], action.value)
        .setIn(['changed', action.id, action.column], action.value)
        ;
      });

    case DevicesWatering.LOAD_OPERATIONAL_RECORDS_REQUEST:
      // 実績の取得開始
      return state.set('progress', true);

    case DevicesWatering.LOAD_OPERATIONAL_RECORDS_SUCCESS:
      // 実績の取得完了
      return state.withMutations(map => { map
        .set('operationalRecords', fromJS(action.operationalRecords))
        .set('progress', false)
        ;
      });

    case DevicesWatering.LOAD_OPERATIONAL_RECORDS_FAILURE:
      // 実績の取得失敗
      return state.set('progress', false);

    default:
      return state;
  }
}

export default deviceWatering;
