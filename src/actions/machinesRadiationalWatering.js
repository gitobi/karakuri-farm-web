import { Map } from 'immutable';
import {MachinesRadiationalWatering} from '../constants/machinesRadiationalWatering';
import GtbUtils from '../js/GtbUtils'
import Bastet from '../js/Bastet'
import * as ActionUtils from './actionUtils'

export function loadConfigurations(machineId) {
  return function(dispatch) {
    dispatch({ type: MachinesRadiationalWatering.LOAD_CONFIGURATIONS_REQUEST });
    let bastet = new Bastet();
    return bastet.getRadiationalWateringsFormulae(machineId).then(
      result => {
        dispatch({ type: MachinesRadiationalWatering.LOAD_CONFIGURATIONS_SUCCESS, list: result.data });
      },
      error => {
        dispatch({ type: MachinesRadiationalWatering.LOAD_CONFIGURATIONS_FAILURE, list: error });
      }
    );
  }
};

export function saveConfigurations(machineId, items, changed) {
  return function(dispatch) {

    if (!ActionUtils.checkValid(changed)) {
      // TODO エラーが存在するためBastetへの更新を行わない場合の画面表示メッセージ
      console.log('check error', changed);
      return false;
    }

    dispatch({ type: MachinesRadiationalWatering.SAVE_CONFIGURATIONS_REQUEST });
    let bastet = new Bastet();

    var promises = [];
    Object.keys(changed).forEach((key) => {
      var change = changed[key];
      var item = GtbUtils.find(items, 'id', key);
      var params = Map(item)
        .merge(Map(change))
        .toJS();

      // console.log('changed', changed);
      // console.log('items', items);
      // console.log('change', change);
      // console.log('item', item);
      console.log('params', params);

      switch (params._state) {
       case 'create':
        // 新規
        promises.push(ActionUtils.ApiRequest(
          dispatch,
          MachinesRadiationalWatering.POST_CONFIGURATIONS_REQUEST,
          MachinesRadiationalWatering.POST_CONFIGURATIONS_SUCCESS,
          MachinesRadiationalWatering.POST_CONFIGURATIONS_FAILURE,
          bastet,
          bastet.createRadiationalWateringsFormula,
          [machineId, params],
          key
        ));
        break;

      case 'delete':
        // 削除
        promises.push(ActionUtils.ApiRequest(
          dispatch,
          MachinesRadiationalWatering.DELETE_CONFIGURATIONS_REQUEST,
          MachinesRadiationalWatering.DELETE_CONFIGURATIONS_SUCCESS,
          MachinesRadiationalWatering.DELETE_CONFIGURATIONS_FAILURE,
          bastet,
          bastet.deleteRadiationalWateringsFormula,
          [machineId, params],
          key
        ));
        break;

      default:
        // 更新
        promises.push(ActionUtils.ApiRequest(
          dispatch,
          MachinesRadiationalWatering.PUT_CONFIGURATIONS_REQUEST,
          MachinesRadiationalWatering.PUT_CONFIGURATIONS_SUCCESS,
          MachinesRadiationalWatering.PUT_CONFIGURATIONS_FAILURE,
          bastet,
          bastet.updateRadiationalWateringsFormula,
          [machineId, params],
          key
        ));
        break
      }
    });

    return Promise.all(promises).then(
      result => dispatch({ type: MachinesRadiationalWatering.SAVE_CONFIGURATIONS_SUCCESS }),
      error => dispatch({ type: MachinesRadiationalWatering.SAVE_CONFIGURATIONS_FAILURE, error: error })
    );
  }
};

export function addConfigurations(deviceId) {
  return {
    type: MachinesRadiationalWatering.ADD_CONFIGURATION,
    deviceId: deviceId,
  };
};

export function removeConfigurations(id) {
  return {
    type: MachinesRadiationalWatering.REMOVE_CONFIGURATION,
    id: id,
  };
};

export function updateConfigurations(id, column, value, error) {
  return {
    type: MachinesRadiationalWatering.UPDATE_CONFIGURATION,
    id: id,
    column: column,
    value: value,
    error: error,
  };
};

export function loadRadiationalWateringOperationalRecords(deviceId) {
  return function(dispatch) {
    dispatch({ type: MachinesRadiationalWatering.LOAD_OPERATIONAL_RECORDS_REQUEST });
    let bastet = new Bastet();
    return bastet.getWateringsOperationalRecords(deviceId).then(
      result => dispatch({ type: MachinesRadiationalWatering.LOAD_OPERATIONAL_RECORDS_SUCCESS, operationalRecords: result.data }),
      error => {
        dispatch({ type: MachinesRadiationalWatering.LOAD_CONFIGURATIONS_FAILURE, items: error })
      }
    );
  }
};



