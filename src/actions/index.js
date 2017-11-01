import * as types from '../constants/ActionTypes';

export function loadDeviceWaterings() {
  return { type: types.LOAD_DEVICE_WATERINGS };
};

export function selectDeviceWaterings(id) {
  return {
    type: types.SELECT_DEVICE_WATERINGS,
    id: id
  };
};

export function loadDeviceWateringSchedules() {
  return { type: types.LOAD_DEVICE_WATERING_SCHEDULES };
};

export function saveDeviceWateringSchedules() {
  return { type: types.SAVE_DEVICE_WATERING_SCHEDULES };
};

export function addDeviceWateringSchedule() {
  return { type: types.ADD_DEVICE_WATERING_SCHEDULE };
};

export function removeDeviceWateringSchedule(id) {
  return {
    type: types.REMOVE_DEVICE_WATERING_SCHEDULE,
    id: id,
  };
};

export function updateDeviceWateringSchedule(id, column, value) {
  return {
    type: types.UPDATE_DEVICE_WATERING_SCHEDULE,
    id: id,
    column: column,
    value: value,
  };
};

