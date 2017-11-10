import { Map } from 'immutable';
import {DevicesWatering} from '../constants/devicesWatering';
import GtbUtils from '../js/GtbUtils'
import Bastet from '../js/Bastet'

export function loadDevicesWaterings() {
  return function(dispatch) {
    dispatch({ type: DevicesWatering.LOAD_REQUEST });

    let bastet = new Bastet();
    return bastet.getDevicesWaterings().then(
      result => {
        dispatch({ type: DevicesWatering.LOAD_SUCCESS, list: result });

        if (0 !== result.length) {
          // データが存在する場合は先頭要素を選択状態とする
          dispatch(selectDevicesWatering(result[0].id));
        }
      },
      error => {
        // DEBUG エラー時にダミーデータを使用する場合
        // これは将来的に削除されるか、もっとスマートな形で実装される
        dispatch({ type: DevicesWatering.LOAD_SUCCESS, list: _load()})
        // dispatch({ type: DevicesWatering.LOAD_FAILURE, list: error })
      }
    );
  }
};

export function selectDevicesWatering(deviceId, lastDeviceId) {
  if (deviceId === lastDeviceId) {
    return function(dispatch) {
      dispatch({ type: DevicesWatering.SELECT, id: deviceId });
    }

  } else {
    // デバイスIDが変更された場合はスケジュールの再読込も行う
    // TODO このハンドリングは別の場所で行うべきかもしれない
    // TODO 現状、デバイスIDが変更される度にスケジュール情報をBastetから取得することになるが、タンクすべきかもしれない
    return function(dispatch) {
      dispatch({ type: DevicesWatering.SELECT, id: deviceId });
      dispatch(loadDevicesWateringSchedules(deviceId));
    }
  }
};

export function loadDevicesWateringSchedules(deviceId) {
  return function(dispatch) {
    dispatch({ type: DevicesWatering.LOAD_SCHEDULES_REQUEST });
    let bastet = new Bastet();
    return bastet.getWateringsSchedules(deviceId).then(
      result => dispatch({ type: DevicesWatering.LOAD_SCHEDULES_SUCCESS, schedules: result.data.schedules }),
      error => {
        // DEBUG エラー時にダミーデータを使用する場合
        // これは将来的に削除されるか、もっとスマートな形で実装される
        dispatch({ type: DevicesWatering.LOAD_SCHEDULES_SUCCESS, schedules: _loadSchedules()})
        // dispatch({ type: DevicesWatering.LOAD_SCHEDULES_FAILURE, schedules: error })
      }
    );
  }
};

export function saveDevicesWateringSchedules(schedules, changed) {
  return function(dispatch) {
    dispatch({ type: DevicesWatering.SAVE_SCHEDULES_REQUEST });
    let bastet = new Bastet();

    var promises = [];
    Object.keys(changed).forEach((key) => {
      var change = changed[key];
      var schedule = GtbUtils.find(schedules, 'id', key);
      var params = Map(schedule)
        .merge(Map(change))
        .toJS();

      // console.log('changed', changed);
      // console.log('schedules', schedules);
      // console.log('change', change);
      // console.log('schedule', schedule);
      // console.log('params', params);

      var promise = null;
      if ('create' === params._state) {
        // 新規
        dispatch({ type: DevicesWatering.POST_SCHEDULES_REQUEST });
        promise = bastet.createWateringsSchedule(params.device_id, params).then(
          result => {
            dispatch({
              type: DevicesWatering.POST_SCHEDULES_SUCCESS,
              change: change,
              schedule: schedule,
              params: params,
              result: result.data.schedules,
            });
          },
          error => {
            dispatch({ type: DevicesWatering.POST_SCHEDULES_FAILURE });
          }
        );

      } else if ('delete' === params._state) {
        // 削除
        dispatch({ type: DevicesWatering.DELETE_SCHEDULES_REQUEST });
        promise = bastet.deleteWateringsSchedule(params.device_id, params.id).then(
          result => {
            dispatch({
              type: DevicesWatering.DELETE_SCHEDULES_SUCCESS,
              change: change,
              schedule: schedule,
              params: params,
              result: result.data.schedules,
            });
          },
          error => {
            dispatch({ type: DevicesWatering.DELETE_SCHEDULES_FAILURE });
          }
        );

      } else {
        // 更新
        dispatch({ type: DevicesWatering.PUT_SCHEDULES_REQUEST });
        promise = bastet.updateWateringsSchedule(params.device_id, params.id, params).then(
          result => {
            dispatch({
              type: DevicesWatering.PUT_SCHEDULES_SUCCESS,
              change: change,
              schedule: schedule,
              params: params,
              result: result.data.schedules,
            });
          },
          error => {
            dispatch({ type: DevicesWatering.PUT_SCHEDULES_FAILURE });
          }
        );
      }
      promises.push(promise);
    });

    return Promise.all(promises).then(
      result => dispatch({ type: DevicesWatering.SAVE_SCHEDULES_SUCCESS }),
      error => dispatch({ type: DevicesWatering.SAVE_SCHEDULES_FAILURE })
    );
  }
};

export function addDevicesWateringSchedule() {
  return { type: DevicesWatering.ADD_SCHEDULE };
};

export function removeDevicesWateringSchedule(id) {
  return {
    type: DevicesWatering.REMOVE_SCHEDULE,
    id: id,
  };
};

export function updateDevicesWateringSchedule(id, column, value) {
  return {
    type: DevicesWatering.UPDATE_SCHEDULE,
    id: id,
    column: column,
    value: value,
  };
};

/**
 * FOR DEBUG
 */
const _load = () => {
  return [
    { key: "1", id: 1, name: "device 1",},
    { key: "2", id: 2, name: "device 2",},
  ];
}

/**
 * FOR DEBUG
 */
const _loadSchedules = (deviceId) => {
  return [
    { id: deviceId + "1", name: deviceId + "schedules 1", start_at: "07:00:00", stop_at: "07:00:0" + deviceId, amount: "100", },
    { id: deviceId + "2", name: deviceId + "schedules 2", start_at: "08:00:00", stop_at: "08:00:0" + deviceId, amount: "200", },
  ];
}

