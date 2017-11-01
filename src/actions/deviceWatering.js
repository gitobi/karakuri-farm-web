import {DeviceWatering} from '../constants/deviceWatering';

export function loadDeviceWaterings() {
  return { type: DeviceWatering.LOAD };
};

export function selectDeviceWaterings(id) {
  return {
    type: DeviceWatering.SELECT,
    id: id
  };
};

export function loadDeviceWateringSchedules() {
  return { type: DeviceWatering.LOAD_SCHEDULES };
};

export function saveDeviceWateringSchedules() {
  return { type: DeviceWatering.SAVE_SCHEDULES };
};

export function addDeviceWateringSchedule() {
  return { type: DeviceWatering.ADD_SCHEDULE };
};

export function removeDeviceWateringSchedule(id) {
  return {
    type: DeviceWatering.REMOVE_SCHEDULE,
    id: id,
  };
};

export function updateDeviceWateringSchedule(id, column, value) {
  return {
    type: DeviceWatering.UPDATE_SCHEDULE,
    id: id,
    column: column,
    value: value,
  };
};

