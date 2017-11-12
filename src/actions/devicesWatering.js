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

      switch (params._state) {
       case 'create':
        // 新規
        promises.push(apiDevicesWateringSchedule(
          dispatch,
          DevicesWatering.POST_SCHEDULES_REQUEST,
          DevicesWatering.POST_SCHEDULES_SUCCESS,
          DevicesWatering.POST_SCHEDULES_FAILURE,
          bastet,
          bastet.createWateringsSchedule,
          params,
        ));
        break;

      case 'delete':
        // 削除
        promises.push(apiDevicesWateringSchedule(
          dispatch,
          DevicesWatering.DELETE_SCHEDULES_REQUEST,
          DevicesWatering.DELETE_SCHEDULES_SUCCESS,
          DevicesWatering.DELETE_SCHEDULES_FAILURE,
          bastet,
          bastet.deleteWateringsSchedule,
          params,
        ));
        break;

      default:
        // 更新
        promises.push(apiDevicesWateringSchedule(
          dispatch,
          DevicesWatering.PUT_SCHEDULES_REQUEST,
          DevicesWatering.PUT_SCHEDULES_SUCCESS,
          DevicesWatering.PUT_SCHEDULES_FAILURE,
          bastet,
          bastet.updateWateringsSchedule,
          params,
        ));
        break
      }
    });

    return Promise.all(promises).then(
      result => dispatch({ type: DevicesWatering.SAVE_SCHEDULES_SUCCESS }),
      error => dispatch({ type: DevicesWatering.SAVE_SCHEDULES_FAILURE, error: error })
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
 * Api For DevicesWateringSchedule Wrapper
 * @param  {[type]} dispatch          [description]
 * @param  {[type]} actionTypeRequest [description]
 * @param  {[type]} actionTypeSuccess [description]
 * @param  {[type]} actionTypeFailure [description]
 * @param  {[type]} bastet            [description]
 * @param  {[type]} bastetApi         [description]
 * @param  {[type]} params            [description]
 * @param  {[type]}                   [description]
 * @return {[type]}                   [description]
 */
const apiDevicesWateringSchedule = (
  dispatch,
  actionTypeRequest,
  actionTypeSuccess,
  actionTypeFailure,
  bastet,
  bastetApi,
  params,
  ) => {
  dispatch({ type: actionTypeRequest });
  return bastetApi.call(bastet, params.device_id, params).then(
    result => {
      dispatch({
        type: actionTypeSuccess,
        params: params,
        result: result.data.schedule,
      });
    },
    error => {
      dispatch({
        type: actionTypeFailure,
        error: error,
      });
    }
  );
}

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

