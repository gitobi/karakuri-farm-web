import {DevicesWatering} from '../constants/devicesWatering';
import Bastet from '../js/Bastet'

export function loadDevicesWaterings() {
  return function(dispatch) {
    dispatch({ type: DevicesWatering.LOAD_REQUEST });

    let bastet = new Bastet();
    return bastet.getDevicesWaterings().then(
      result => dispatch({ type: DevicesWatering.LOAD_SUCCESS, list: result }),
      error => {
        // DEBUG エラー時にダミーデータを使用する場合
        // これは将来的に削除されるか、もっとスマートな形で実装される
        dispatch({ type: DevicesWatering.LOAD_SUCCESS, list: _load()})
        // dispatch({ type: DevicesWatering.LOAD_FAILURE, list: error })
      }
    );
  }
};

export function selectDevicesWatering(id) {
  return {
    type: DevicesWatering.SELECT,
    id: id
  };
};

export function loadDevicesWateringSchedules() {
  return { type: DevicesWatering.LOAD_SCHEDULES };
};

export function saveDevicesWateringSchedules() {
  return { type: DevicesWatering.SAVE_SCHEDULES };
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

