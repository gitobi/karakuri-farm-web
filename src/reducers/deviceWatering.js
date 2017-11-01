import { DeviceWatering } from '../constants/deviceWatering';
import GtbUtils from '../js/GtbUtils'
import Logger from '../js/Logger'

const _logger = new Logger({prefix: 'deviceWatering'});

const initialDeviceWatering = {
  'list': [],
  'schedules': [],
  'selectedId': '',

  'changed': {},
};

const deviceWatering = (state = initialDeviceWatering, action) => {
  let data = {};
  switch (action.type) {
    case DeviceWatering.LOAD:
      data = Object.assign({}, state);

      // wateringsをgetする
      _load(data);

      // 存在する場合は先頭要素を選択状態とする
      if (0 === data.list.length) {
        data.selectedId = ''
      } else {
        data.selectedId = data.list[0].id;
      }
      _select(data);

      // console.log(state, action, data);
      return data;

    case DeviceWatering.SELECT:
      data = Object.assign({}, state);

      // 指定された要素を選択状態にする
      data.selectedId = action.id;
      _select(data);

      // scheduleをgetする
      _loadSchedules(data);
      return data;

    case DeviceWatering.LOAD_SCHEDULES:
      data = Object.assign({}, state);

      // schedulesをgetする
      _loadSchedules(data);
      return data;

    case DeviceWatering.SAVE_SCHEDULES:
      // TODO schedulesをpost/putする
      data = Object.assign({}, state);
      _logger.info('save ... ', data);
      return data;

    case DeviceWatering.ADD_SCHEDULE:
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

    case DeviceWatering.REMOVE_SCHEDULE:
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

    case DeviceWatering.UPDATE_SCHEDULE:
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

/**
 * get DeviceWaterings
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const _load = (data) => {
  var list = data.list;
  list.splice(0, list.length);
  list.push({
    key: "1",
    id: 1,
    name: "device 1",
  });
  list.push({
    key: "2",
    id: 2,
    name: "device 2",
  });
}

/**
 * listにactive項目を付与する
 * TODO viewのために仕方なく必要な処理であるため、ここでやるべきではないかも
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const _select = (data) => {
  data.list.forEach((object) => {
    object["active"] = object.id === data.selectedId;
  });
}

/**
 * get DeviceWateringSchedules
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const _loadSchedules = (data) => {
  var id = data.selectedId;
  var schedules = data.schedules;
  schedules.splice(0, schedules.length);
  schedules.push({
    id: id + "1",
    name: id + " schedules 1",
    start_at: "07:00:00",
    stop_at: "07:00:0" + id,
    amount: "100",
  });
  schedules.push({
    id: id + "2",
    name: id + " schedules 2",
    start_at: "08:00:00",
    stop_at: "08:00:0" + id,
    amount: "200",
  });
}

export default deviceWatering;
