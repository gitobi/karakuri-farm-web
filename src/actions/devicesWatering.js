import { Map } from 'immutable';
import {DevicesWatering} from '../constants/devicesWatering';
import GtbUtils from '../js/GtbUtils'
import moment from 'moment';
import Bastet from '../js/Bastet'
import * as ActionUtils from './actionUtils'

export function loadDevicesWateringWorkingDays(deviceId) {
  return function(dispatch) {
    dispatch({ type: DevicesWatering.LOAD_WORKING_DAYS_REQUEST });
    let params = {date_trunc: "day"}
    let bastet = new Bastet();
    return bastet.getWateringsStats(deviceId, params).then(
      result => dispatch({ type: DevicesWatering.LOAD_WORKING_DAYS_SUCCESS, data: result.data }),
      error => {
        return dispatch({ type: DevicesWatering.LOAD_WORKING_DAYS_FAILURE, error: error });
      }
    );
  }
};

export function loadDevicesWateringOperationalRecords(deviceId, date) {
  return function(dispatch) {
    dispatch({ type: DevicesWatering.LOAD_OPERATIONAL_RECORDS_REQUEST });

    let params = {};
    if (date) {
      let replaced = date.replace(new RegExp("/","g"), "-");
      let min = moment(`${replaced} 00:00:00`);
      let max = moment(`${replaced} 23:59:59`);
      params = {filtered: [{id: "started_at", value: {min: min, max: max}}]};
    }

    let bastet = new Bastet();
    return bastet.getWateringsOperationalRecords(deviceId, params).then(
      result => dispatch({ type: DevicesWatering.LOAD_OPERATIONAL_RECORDS_SUCCESS, operationalRecords: result.data }),
      error => {
        dispatch({ type: DevicesWatering.LOAD_SCHEDULES_FAILURE, schedules: error })
      }
    );
  }
};

export function loadDevicesWateringStats(deviceId, unit) {
  return function(dispatch) {
    dispatch({ type: DevicesWatering.LOAD_STATS_REQUEST });
    let params = {date_trunc: unit}
    let bastet = new Bastet();
    return bastet.getWateringsStats(deviceId, params).then(
      result => {
        // console.log("action loaded:", result);
        return dispatch({ type: DevicesWatering.LOAD_STATS_SUCCESS, stats: result.data, unit: unit })
      },
      error => {
        return dispatch({ type: DevicesWatering.LOAD_STATS_FAILURE, error: error });
      }
    );
  }
};

export function loadDevicesWateringSchedules(deviceId) {
  return function(dispatch) {
    dispatch({ type: DevicesWatering.LOAD_SCHEDULES_REQUEST });
    let bastet = new Bastet();
    return bastet.getWateringsSchedules(deviceId).then(
      result => dispatch({ type: DevicesWatering.LOAD_SCHEDULES_SUCCESS, schedules: result.data.schedules }),
      error => {
        dispatch({ type: DevicesWatering.LOAD_SCHEDULES_FAILURE, schedules: error })
      }
    );
  }
};

export function saveDevicesWateringSchedules(deviceId, schedules, changed) {
  return function(dispatch) {

    if (!ActionUtils.checkValid(changed)) {
      // TODO エラーが存在するためBastetへの更新を行わない場合の画面表示メッセージ
      console.log('check error', changed);
      return false;
    }

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
          promises.push(ActionUtils.ApiRequest(
            dispatch,
            DevicesWatering.POST_SCHEDULES_REQUEST,
            DevicesWatering.POST_SCHEDULES_SUCCESS,
            DevicesWatering.POST_SCHEDULES_FAILURE,
            bastet,
            bastet.createWateringsSchedule,
            [deviceId, params],
            key
          ));
          break;

        case 'delete':
          // 削除
          promises.push(ActionUtils.ApiRequest(
            dispatch,
            DevicesWatering.DELETE_SCHEDULES_REQUEST,
            DevicesWatering.DELETE_SCHEDULES_SUCCESS,
            DevicesWatering.DELETE_SCHEDULES_FAILURE,
            bastet,
            bastet.deleteWateringsSchedule,
            [deviceId, params],
            key
          ));
          break;

        default:
          // 更新
          promises.push(ActionUtils.ApiRequest(
            dispatch,
            DevicesWatering.PUT_SCHEDULES_REQUEST,
            DevicesWatering.PUT_SCHEDULES_SUCCESS,
            DevicesWatering.PUT_SCHEDULES_FAILURE,
            bastet,
            bastet.updateWateringsSchedule,
            [deviceId, params],
            key
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

export function addDevicesWateringSchedule(deviceId) {
  return {
    type: DevicesWatering.ADD_SCHEDULE,
    deviceId: deviceId,
  };
};

export function removeDevicesWateringSchedule(id) {
  return {
    type: DevicesWatering.REMOVE_SCHEDULE,
    id: id,
  };
};

export function updateDevicesWateringSchedule(id, column, value, error) {
  return {
    type: DevicesWatering.UPDATE_SCHEDULE,
    id: id,
    column: column,
    value: value,
    error: error,
  };
};
