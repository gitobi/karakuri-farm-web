import { DevicesWatering } from '../constants/devicesWatering';
import GtbUtils from '../js/GtbUtils'
import Logger from '../js/Logger'

const _logger = new Logger({prefix: 'devicesWatering'});

const initialDevicesWatering = {
  'list': [],
  'schedules': [],
  'selectedId': '',

  'changed': {},
};

const deviceWatering = (state = initialDevicesWatering, action) => {
  _logger.info('state :', state);
  _logger.info('action :', action);
  let data = {};
  switch (action.type) {
    case DevicesWatering.LOAD_REQUEST:
      // デバイス情報の取得開始
      return state;

    case DevicesWatering.LOAD_SUCCESS:
      // デバイス情報の取得完了
      data = Object.assign({},
        state,
        {list: [...state.list]},
      );
      data.list.splice(0, data.list.length);

      let list = action.list.map((value) => {
          return {
            key: value["key"],
            id: value["id"],
            name: value["name"],
          };
        });
      data.list.push(...list)

      return data;

    case DevicesWatering.LOAD_FAILURE:
      // デバイス情報の取得失敗
      return state;

    case DevicesWatering.SELECT:
      // デバイスの選択
      data = Object.assign({},
        state,
        {list: [...state.list]},
      );

      // 指定された要素を選択状態にする
      data.selectedId = action.id;
      data.list.forEach((object) => {
        // TODO viewのために仕方なく必要な処理であるため、ここでやるべきではないかも
        object["active"] = object.id === data.selectedId;
      });
      return data;

    case DevicesWatering.LOAD_SCHEDULES_REQUEST:
      // スケジュール情報の取得開始
      return state;

    case DevicesWatering.LOAD_SCHEDULES_SUCCESS:
      // スケジュール情報の取得完了
      data = Object.assign({},
        state,
        {schedules: [...state.schedules]},
      );
      data.schedules.splice(0, data.schedules.length);
      data.schedules.push(...action.schedules)
      return data;

    case DevicesWatering.LOAD_SCHEDULES_FAILURE:
      // スケジュール情報の取得失敗
      return state;

    case DevicesWatering.SAVE_SCHEDULES:
      // スケジュールのセーブ
      // TODO schedulesをpost/putする
      data = Object.assign({}, state);
      _logger.info('save ... ', data);
      return data;

    case DevicesWatering.ADD_SCHEDULE:
      // スケジュールを追加する
      data = Object.assign({},
        state,
        {schedules: [...state.schedules]},
      );

      // 一時IDを発行する
      var tmpId = GtbUtils.getTmpId(
        data.schedules.map((row) => {
          return row.id
        }));

      // 行を作成して追加
      var row = {
        id: tmpId,
        device_id: data.selectedId,
      }
      data.schedules.push(row);

      return data;

    case DevicesWatering.REMOVE_SCHEDULE:
      // スケジュールを削除する
      data = Object.assign({},
        state,
        {schedules: [...state.schedules]},
      );

      data.schedules.some((row, index) => {
        if (row.id === action.id) {
          data.schedules.splice(index, 1);
          return true;
        }
        return false;
      });

      return data;

    case DevicesWatering.UPDATE_SCHEDULE:
      // スケジュールを更新する
      data = Object.assign({},
        state,
        {schedules: [...state.schedules]},
      );

      var index = GtbUtils.find(data.schedules, 'id', action.id);
      data.schedules[index][action.column] = action.value;

      return data;

    default:
      return state;
  }
}

export default deviceWatering;
