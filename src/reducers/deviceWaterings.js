import * as types from '../constants/ActionTypes';
import GtbUtils from '../js/GtbUtils'
import Logger from '../js/Logger'

const _logger = new Logger({prefix: 'deviceWaterings'});

const initialDeviceWaterings = {
  'deviceWaterings': [],
  'deviceWateringsSchedules': [],
  'selectedDeviceWateringsId': '',

  'changed': {},
};

const deviceWaterings = (state = initialDeviceWaterings, action) => {
  let data = {};
  switch (action.type) {
    case types.LOAD_DEVICE_WATERINGS:
      data = Object.assign({}, state);

      // wateringsをgetする
      _loadDeviceWaterings(data);

      // 存在する場合は先頭要素を選択状態とする
      if (0 === data.deviceWaterings.length) {
        data.selectedDeviceWateringsId = ''
      } else {
        data.selectedDeviceWateringsId = data.deviceWaterings[0].id;
      }
      _selectDeviceWatering(data);

      // console.log(state, action, data);
      return data;

    case types.SELECT_DEVICE_WATERINGS:
      data = Object.assign({}, state);

      // 指定された要素を選択状態にする
      data.selectedDeviceWateringsId = action.id;
      _selectDeviceWatering(data);

      // scheduleをgetする
      _loadDeviceWateringSchedules(data);
      return data;

    case types.LOAD_DEVICE_WATERING_SCHEDULES:
      data = Object.assign({}, state);

      // schedulesをgetする
      _loadDeviceWateringSchedules(data);
      return data;

    case types.SAVE_DEVICE_WATERING_SCHEDULES:
      // TODO schedulesをpost/putする
      data = Object.assign({}, state);
      _logger.info('save ... ', data);
      return data;

    case types.ADD_DEVICE_WATERING_SCHEDULE:
      // スケジュールを追加する
      data = Object.assign({},
        state,
        {deviceWateringsSchedules: [...state.deviceWateringsSchedules]},
      );

      // 一時IDを発行する
      var tmpId = GtbUtils.getTmpId(
        data.deviceWateringsSchedules.map((row) => {
          return row.id
        }));

      // 行を作成して追加
      var row = {
        id: tmpId,
        device_id: data.selectedDeviceWateringsId,
      }
      data.deviceWateringsSchedules.push(row);

      return data;

    case types.REMOVE_DEVICE_WATERING_SCHEDULE:
      // スケジュールを削除する
      data = Object.assign({},
        state,
        {deviceWateringsSchedules: [...state.deviceWateringsSchedules]},
      );

      data.deviceWateringsSchedules.some((row, index) => {
        if (row.id === action.id) {
          data.deviceWateringsSchedules.splice(index, 1);
          return true;
        }
        return false;
      });

      return data;

    case types.UPDATE_DEVICE_WATERING_SCHEDULE:
      // スケジュールを更新する
      data = Object.assign({},
        state,
        {deviceWateringsSchedules: [...state.deviceWateringsSchedules]},
      );

      var index = GtbUtils.find(data.deviceWateringsSchedules, 'id', action.id);
      data.deviceWateringsSchedules[index][action.column] = action.value;

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
const _loadDeviceWaterings = (data) => {
  var deviceWaterings = data.deviceWaterings;
  deviceWaterings.splice(0, deviceWaterings.length);
  deviceWaterings.push({
    key: "1",
    id: 1,
    name: "device 1",
  });
  deviceWaterings.push({
    key: "2",
    id: 2,
    name: "device 2",
  });
}

/**
 * deviceWateringsにactive項目を付与する
 * TODO viewのために仕方なく必要な処理であるため、ここでやるべきではないかも
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const _selectDeviceWatering = (data) => {
  data.deviceWaterings.forEach((object) => {
    object["active"] = object.id === data.selectedDeviceWateringsId;
  });
}

/**
 * get DeviceWateringSchedules
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const _loadDeviceWateringSchedules = (data) => {
  var deviceId = data.selectedDeviceWateringsId;
  var deviceWateringsSchedules = data.deviceWateringsSchedules;
  deviceWateringsSchedules.splice(0, deviceWateringsSchedules.length);
  deviceWateringsSchedules.push({
    id: deviceId + "1",
    name: deviceId + " deviceWateringsSchedules 1",
    start_at: "07:00:00",
    stop_at: "07:00:0" + deviceId,
    amount: "100",
  });
  deviceWateringsSchedules.push({
    id: deviceId + "2",
    name: deviceId + " deviceWateringsSchedules 2",
    start_at: "08:00:00",
    stop_at: "08:00:0" + deviceId,
    amount: "200",
  });
}


export default deviceWaterings;
