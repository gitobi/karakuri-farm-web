import { Map } from 'immutable';
import {DevicesWatering} from '../constants/devicesWatering';
import GtbUtils from '../js/GtbUtils'
import Bastet from '../js/Bastet'

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

function checkValid(changed) {
  let valid = true;
  Object.keys(changed).forEach((key) => {
    let change = changed[key];
    let errors = change._errors;
    if (errors) {
      Object.keys(errors).forEach((column) => {
        let error = errors[column];
        valid &= (null === error || undefined === error);
      });
    }
  });
  return valid;
}

export function saveDevicesWateringSchedules(schedules, changed) {
  return function(dispatch) {

    if (!checkValid(changed)) {
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

export function loadDevicesWateringOperationalRecords(deviceId) {
  return function(dispatch) {
    dispatch({ type: DevicesWatering.LOAD_OPERATIONAL_RECORDS_REQUEST });
    let bastet = new Bastet();
    return bastet.getWateringsOperationalRecords(deviceId).then(
      result => dispatch({ type: DevicesWatering.LOAD_OPERATIONAL_RECORDS_SUCCESS, operationalRecords: result.data }),
      error => {
        dispatch({ type: DevicesWatering.LOAD_SCHEDULES_FAILURE, schedules: error })
      }
    );
  }
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
 * @return {[type]}                   [description]
 */
const apiDevicesWateringSchedule = (
  dispatch,
  actionTypeRequest,
  actionTypeSuccess,
  actionTypeFailure,
  bastet,
  bastetApi,
  params
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

