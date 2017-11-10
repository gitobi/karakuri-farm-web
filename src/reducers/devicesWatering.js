import { List, Map, fromJS } from 'immutable';
import { DevicesWatering } from '../constants/devicesWatering';
import GtbUtils from '../js/GtbUtils'
import Logger from '../js/Logger'

const _logger = new Logger({prefix: 'devicesWatering'});

const initialDevicesWatering = Map({
  'list': List([]),
  'schedules': List([]),
  'selectedId': '',

  'changed': {},
});

const deviceWatering = (state = initialDevicesWatering, action) => {
  _logger.info('state :', state.toJS());
  _logger.info('action :', action);
  let data = {};
  switch (action.type) {
    case DevicesWatering.LOAD_REQUEST:
      // デバイス情報の取得開始
      return state;

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

      return state.set('list', fromJS(list));

    case DevicesWatering.LOAD_FAILURE:
      // デバイス情報の取得失敗
      return state;

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
      return state;

    case DevicesWatering.LOAD_SCHEDULES_SUCCESS:
      // スケジュール情報の取得完了
      return state.set('schedules', fromJS(action.schedules));

    case DevicesWatering.LOAD_SCHEDULES_FAILURE:
      // スケジュール情報の取得失敗
      return state;

    case DevicesWatering.SAVE_SCHEDULES_REQUEST:
      // スケジュール情報の保存開始
      return state;

    case DevicesWatering.SAVE_SCHEDULES_SUCCESS:
      // スケジュール情報の保存完了
      // TODO schedulesをpost/putする
      data = Object.assign({}, state);
      _logger.info('save ... ', data);
      return data;

    case DevicesWatering.SAVE_SCHEDULES_FAILURE:
      // スケジュール情報の保存失敗
      return state;

    case DevicesWatering.ADD_SCHEDULE:
      // スケジュールを追加

      // 一時IDを発行する
      var tmpId = GtbUtils.getTmpId(
        state.get('schedules').toJS().map((row) => {
          return row.id
        }));

      // 行を作成して追加
      var row = {
        id: tmpId,
        device_id: data.selectedId,
      }

      return state.update('schedules', schedules => {
        return schedules.push(row)
      });

    case DevicesWatering.REMOVE_SCHEDULE:
      // スケジュールを削除
      var removeIndex = GtbUtils.find(state.get('schedules').toJS(), 'id', action.id);
      return state.deleteIn(['schedules', removeIndex]);

    case DevicesWatering.UPDATE_SCHEDULE:
      // スケジュールを変更
      var updateIndex = GtbUtils.find(state.get('schedules').toJS(), 'id', action.id);
      return state.setIn(['schedules', updateIndex, action.column], action.value);

    default:
      return state;
  }
}

export default deviceWatering;
